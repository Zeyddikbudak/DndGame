from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from django.db.models import Q
from rest_framework.generics import ListAPIView
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import random
from django.core.cache import cache

from .models import Character, Race, Class, CharacterTemplate
from lobbies.models import Lobby, LobbyPlayer
from .serializers import CharacterTemplateSerializer, RaceSerializer, ClassSerializer, CharacterSerializer

class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return

# CharacterViewSet: Level up işlemleri vb.
class CharacterViewSet(viewsets.ModelViewSet):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CharacterSerializer

    def get_queryset(self):
        user_id = self.request.user.id
        return Character.objects.filter(player_id=user_id)

    @action(detail=True, methods=['get'], url_path='level-up-info')
    def level_up_info(self, request, pk=None):
        character = self.get_object()
        if not character.can_level_up:
            return Response({"error": "Level up için yeterli XP yok."}, status=status.HTTP_400_BAD_REQUEST)
        info = character.level_up_info()
        return Response({
            "message": "Level up bilgileri hazır.",
            "current_level": character.level,
            "xp": character.xp,
            "xp_threshold": character.xp_for_next_level(),
            "level_up_info": info
        })

    @action(detail=True, methods=['post'], url_path='confirm-level-up')
    def confirm_level_up(self, request, pk=None):
        character = self.get_object()
        if not character.can_level_up:
            return Response({"error": "Level up için yeterli XP yok."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            info = character.confirm_level_up()
            return Response({
                "message": "Level up tamamlandı.",
                "new_level": character.level,
                "level_up_info": info,
                "xp_threshold": character.xp_for_next_level()
            })
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Initiative order hesaplaması
class InitiateCombatView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        lobby_id = request.data.get("lobby_id")
        character_ids = request.data.get("character_ids", [])
        placements = request.data.get("placements", {})
        available_characters = request.data.get("available_characters", [])
        
        if not lobby_id or not character_ids:
            return Response({"error": "lobby_id ve character_ids gereklidir."}, status=status.HTTP_400_BAD_REQUEST)
        
        combatants = Character.objects.filter(id__in=character_ids)
        initiative_list = []
        for character in combatants:
            roll = character.roll_initiative()
            initiative_list.append({
                "character_id": character.id,
                "name": character.name,
                "initiative": roll
            })
        initiative_list.sort(key=lambda x: x["initiative"], reverse=True)
        
        gridSize = 20
        total_cells = gridSize * gridSize
        if not placements:
            default_cells = [i for i in range(0, total_cells, 10)]
            placements = {}
            for idx, entry in enumerate(initiative_list):
                cell = default_cells[idx % len(default_cells)]
                character = combatants.get(id=entry["character_id"])
                placements[str(cell)] = {
                    "id": character.id,
                    "name": character.name,
                    "player_id": character.player_id,
                    "lobby_id": character.lobby_id,
                    "dexterity": getattr(character, 'dexterity', 10),
                }
        
        battle_state = {
            "initiative_order": initiative_list,
            "placements": placements,
            "available_characters": available_characters,
            "current_turn_index": 0,
            "chat_log": []
        }
        cache.set(f"battle_state_{lobby_id}", battle_state)
        
        return Response({
            "message": "Initiative order oluşturuldu.",
            "initiative_order": initiative_list,
            "placements": placements
        })
    
    



class MeleeAttackView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        attacker_id = request.data.get("attacker_id")
        target_id = request.data.get("target_id")
        lobby_id = request.data.get("lobby_id")
        if not attacker_id or not target_id or not lobby_id:
            return Response({"error": "attacker_id, target_id ve lobby_id gereklidir."},
                            status=status.HTTP_400_BAD_REQUEST)
        
        attacker = get_object_or_404(Character, id=attacker_id)
        target = get_object_or_404(Character, id=target_id)
        
        gridSize = 20
        battle_state = cache.get(f"battle_state_{lobby_id}")
        if not battle_state or "placements" not in battle_state:
            return Response({"error": "Battle state bulunamadı."},
                            status=status.HTTP_400_BAD_REQUEST)
        placements = battle_state["placements"]
        
        attacker_cell = None
        target_cell = None
        for key, value in placements.items():
            if value:
                if value.get("id") == attacker.id:
                    attacker_cell = int(key)
                if value.get("id") == target.id:
                    target_cell = int(key)
        if attacker_cell is None or target_cell is None:
            return Response({"error": "Saldırgan veya hedefin konumu bulunamadı."},
                            status=status.HTTP_400_BAD_REQUEST)
        
        attacker_row, attacker_col = divmod(attacker_cell, gridSize)
        target_row, target_col = divmod(target_cell, gridSize)
        
        if not ((attacker_row == target_row and abs(attacker_col - target_col) == 1) or 
                (attacker_col == target_col and abs(attacker_row - target_row) == 1)):
            return Response({"error": "Hedef, saldırıya uygun mesafede değil. Yakın dövüş saldırısı yalnızca bitişik karelere yapılabilir."},
                            status=status.HTTP_400_BAD_REQUEST)
        
        damage = attacker.normal_attack_damage()
        target.hp = max(0, target.hp - damage)
        target.save()
        
        new_message = f"{attacker.name} {target.name}'e yakın dövüş saldırısı yaptı ve {damage} hasar verdi (Kalan HP: {target.hp})."
        chat_log = battle_state.get("chat_log", [])
        chat_log.append(new_message)
        battle_state["chat_log"] = chat_log
        cache.set(f"battle_state_{lobby_id}", battle_state)
        
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"lobby_{lobby_id}",
            {
                'type': 'game_message',
                'message': battle_state
            }
        )

        return Response({
            "message": f"{attacker.name} yakın dövüş saldırısı yaptı.",
            "damage": damage,
            "target_remaining_hp": target.hp,
            "chat_log": chat_log
        })

class RangedAttackView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        attacker_id = request.data.get("attacker_id")
        target_id = request.data.get("target_id")
        lobby_id = request.data.get("lobby_id")
        if not attacker_id or not target_id or not lobby_id:
            return Response({"error": "attacker_id, target_id ve lobby_id gereklidir."},
                            status=status.HTTP_400_BAD_REQUEST)
        attacker = get_object_or_404(Character, id=attacker_id)
        target = get_object_or_404(Character, id=target_id)

        gridSize = 20
        battle_state = cache.get(f"battle_state_{lobby_id}")
        if not battle_state or "placements" not in battle_state:
            return Response({"error": "Battle state bulunamadı."},
                            status=status.HTTP_400_BAD_REQUEST)
        placements = battle_state["placements"]

        attacker_cell = None
        target_cell = None
        for key, value in placements.items():
            if value:
                if value.get("id") == attacker.id:
                    attacker_cell = int(key)
                if value.get("id") == target.id:
                    target_cell = int(key)
        if attacker_cell is None or target_cell is None:
            return Response({"error": "Saldırgan veya hedefin konumu bulunamadı."},
                            status=status.HTTP_400_BAD_REQUEST)

        attacker_row, attacker_col = divmod(attacker_cell, gridSize)
        target_row, target_col = divmod(target_cell, gridSize)

        if not (abs(attacker_row - target_row) <= 2 and abs(attacker_col - target_col) <= 2):
            return Response({"error": "Hedef, saldırıya uygun mesafede değil. Ranged saldırı 5x5 alanda yapılabilir."},
                            status=status.HTTP_400_BAD_REQUEST)

        roll = random.randint(1, 6)
        # Dexterity bonusu: (dexterity - 10) // 2, minimum 0
        dex_bonus = max((attacker.dexterity - 10) // 2, 0) if hasattr(attacker, 'dexterity') else 0
        damage = roll + dex_bonus
        target.hp = max(0, target.hp - damage)
        target.save()

        new_message = f"{attacker.name} {target.name}'e ranged saldırısı yaptı ve {damage} hasar verdi (Kalan HP: {target.hp})."
        chat_log = battle_state.get("chat_log", [])
        chat_log.append(new_message)
        battle_state["chat_log"] = chat_log
        cache.set(f"battle_state_{lobby_id}", battle_state)

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"lobby_{lobby_id}",
            {
                'type': 'game_message',
                'message': battle_state
            }
        )

        return Response({
            "message": f"{attacker.name} ranged saldırısı yaptı.",
            "damage": damage,
            "target_remaining_hp": target.hp,
            "chat_log": chat_log
        })
    
class EndTurnView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        lobby_id = request.data.get("lobby_id")
        if not lobby_id:
            return Response({"error": "lobby_id gereklidir."}, status=status.HTTP_400_BAD_REQUEST)
        lobby = get_object_or_404(Lobby, lobby_id=lobby_id)
        battle_state = cache.get(f"battle_state_{lobby_id}", {})
        initiative_order = battle_state.get("initiative_order", [])
        current_turn_index = battle_state.get("current_turn_index", 0)
        if not initiative_order:
            return Response({"error": "Initiative order boş."}, status=status.HTTP_400_BAD_REQUEST)
        current_entry = initiative_order[current_turn_index]
        from .models import Character
        try:
            character = Character.objects.get(id=current_entry["character_id"])
        except Character.DoesNotExist:
            character = None
        placements = battle_state.get("placements", {})
        for key, char_data in placements.items():
            if char_data:
                try:
                    char_obj = Character.objects.get(id=char_data["id"])
                    if char_obj.hp <= 0:
                        placements[key] = None
                except Character.DoesNotExist:
                    placements[key] = None
        new_initiative = [entry for i, entry in enumerate(initiative_order) if i != current_turn_index]
        if character and character.hp > 0:
            new_initiative.append(current_entry)
        battle_state["initiative_order"] = new_initiative
        battle_state["current_turn_index"] = 0
        battle_state["placements"] = placements
        cache.set(f"battle_state_{lobby_id}", battle_state)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"lobby_{lobby_id}",
            {
                'type': 'game_message',
                'message': battle_state
            }
        )

        return Response({
            "message": "Turn ended.",
            "initiative_order": new_initiative,
            "placements": placements
        })
    

class EndBattleView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        lobby_id = request.data.get("lobby_id")
        if not lobby_id:
            return Response({"error": "lobby_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Cache'deki battle state'i alıyoruz veya boş bir state oluşturuyoruz.
        battle_state = cache.get(f"battle_state_{lobby_id}", {
            "initiative_order": [],
            "placements": {},
            "available_characters": [],
            "current_turn_index": 0,
            "chat_log": []
        })
        # Battle state'i battleEnd durumuna çeviriyoruz:
        battle_state["battle_end"] = True
        cache.set(f"battle_state_{lobby_id}", battle_state)
        
        # Kanal katmanı üzerinden tüm oyunculara broadcast ediyoruz:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"lobby_{lobby_id}",
            {
                'type': 'game_message',
                'message': battle_state
            }
        )
        return Response({"message": "Battle ended successfully", "battle_state": battle_state}, status=status.HTTP_200_OK)

class BattleStateView(APIView):
    def get(self, request, lobby_id, format=None):
        state = cache.get(f"battle_state_{lobby_id}", {
            "initiative_order": [],
            "placements": {},
            "available_characters": [],
            "current_turn_index": 0,
            "chat_log": []
        })
        return Response(state)

# Yeni: Hareket güncelleme endpoint'i
class MoveCharacterView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        lobby_id = request.data.get("lobby_id")
        new_placements = request.data.get("placements")
        if not lobby_id or new_placements is None:
            return Response({"error": "lobby_id ve placements gereklidir."}, status=status.HTTP_400_BAD_REQUEST)
        battle_state = cache.get(f"battle_state_{lobby_id}", {})
        battle_state["placements"] = new_placements
        cache.set(f"battle_state_{lobby_id}", battle_state)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"lobby_{lobby_id}",
            {
                'type': 'game_message',
                'message': battle_state
            }
        )
        return Response({"message": "Hareket güncellendi", "placements": new_placements})

# Diğer view'ler...
class LobbyViewSet(viewsets.ModelViewSet):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]
    from lobbies.serializers import LobbySerializer, LobbyPlayerSerializer
    serializer_class = LobbySerializer

    def get_queryset(self):
        user = self.request.user
        return Lobby.objects.filter(
            Q(gm_player=user) | Q(players__player=user)
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(gm_player=self.request.user)

    @action(detail=True, methods=['patch'], url_path='players/(?P<player_id>[^/.]+)/ready')
    def set_player_ready(self, request, pk=None, player_id=None):
        lobby = self.get_object()
        lp = get_object_or_404(LobbyPlayer, lobby=lobby, player_id=player_id)
        new_ready = request.data.get('is_ready')
        if new_ready is None:
            return Response({"error": "is_ready is required."}, status=status.HTTP_400_BAD_REQUEST)
        lp.is_ready = bool(new_ready)
        lp.save()
        return Response({
            "message": f"Player with player_id={player_id} is_ready={lp.is_ready}"
        })

    @action(detail=True, methods=['post'], url_path='start_game')
    def start_game(self, request, pk=None):
        lobby = self.get_object()
        if lobby.gm_player != request.user:
            return Response({"error": "Only GM can start the game."}, status=status.HTTP_403_FORBIDDEN)
        players = LobbyPlayer.objects.filter(lobby=lobby)
        if not players.exists():
            return Response({"error": "There are no players in this lobby."}, status=status.HTTP_400_BAD_REQUEST)
        if not all(p.is_ready for p in players):
            return Response({"error": "Not all players are ready!"}, status=status.HTTP_400_BAD_REQUEST)
        lobby.is_battle_arena_ready = True
        lobby.is_active = False
        lobby.save()
        return Response({"message": "Game started!", "lobby_id": lobby.lobby_id})

class CreateLobbyView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        from lobbies.serializers import LobbySerializer
        serializer = LobbySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(gm_player=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RaceListView(ListAPIView):
    queryset = Race.objects.all()
    serializer_class = RaceSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [CsrfExemptSessionAuthentication]

class ClassListView(ListAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [CsrfExemptSessionAuthentication]

class CharacterTemplateListView(ListAPIView):
    queryset = CharacterTemplate.objects.all()
    serializer_class = CharacterTemplateSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [CsrfExemptSessionAuthentication]

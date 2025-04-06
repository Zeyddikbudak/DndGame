from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.core.cache import cache

class GameConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.lobby_id = self.scope['url_route']['kwargs'].get('lobby_id', 'default')
        self.group_name = f"lobby_{self.lobby_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        if content.get("event") == "battleUpdate":
            lobby_state = cache.get(f"battle_state_{self.lobby_id}", {})
            if "placements" in content:
                lobby_state["placements"] = content["placements"]
            if "chatLog" in content:
                lobby_state["chat_log"] = content["chatLog"]
            if "availableCharacters" in content:
                lobby_state["available_characters"] = content["availableCharacters"]
            cache.set(f"battle_state_{self.lobby_id}", lobby_state)
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'game_message',
                    'message': lobby_state,
                }
            )
        else:
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'game_message',
                    'message': content,
                }
            )

    async def game_message(self, event):
        message = event['message']
        await self.send_json(message)

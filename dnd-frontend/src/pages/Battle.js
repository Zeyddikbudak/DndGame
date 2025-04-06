import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import socket, { getSocket, connect as reconnect } from '../services/socket';
import SpellPanel from '../components/SpellPanel';

import {
  handleMagicMissile,
  handleFireShield,
  handleIceStorm,
  handlePrismaticSpray,
  handleDispelMagic,
  handleAnimateDead,
  handleBanishment,
  handleCircleOfDeath,
  handleCloudkill,
  handleConfusion,
  handleDelayedBlastFireball,
  handleDimensionDoor,
  handleDominateMonster,
  handleFeeblemind,
  handleTrueResurrection,
  handleForcecage,
  handleTelekinesis,
  handleEarthbind,
  handleMindBlank,
  handleMaze,
  handlePowerWordKill,
  handleFingerOfDeath,
  handleGlobeOfInvulnerability,
  handleOttosIrresistibleDance,
  handleSymbol,
  handleMassHeal,
  handleChainLightning,
  handleReverseGravity,
  handleFleshToStone,
  handleAnimateObjects,
  handleAntimagicField,
  handleEyebite,
  handleControlWeather,
  handleHolyAura,
  handleWish
} from '../components/spells';

const gridSize = 20; // 20x20 grid
const totalCells = gridSize * gridSize;

const Battle = () => {
  const { id } = useParams();
  let lobbyId = id || localStorage.getItem('lobbyId') || "6";
  if (!localStorage.getItem('lobbyId')) {
    localStorage.setItem('lobbyId', lobbyId);
  }
  console.log("Battle.js - lobbyId:", lobbyId);

  const [lobbyData, setLobbyData] = useState(null);
  const [isGM, setIsGM] = useState(false);
  const [allCharacters, setAllCharacters] = useState([]);
  const [availableCharacters, setAvailableCharacters] = useState([]);
  const [placements, setPlacements] = useState({});
  const [battleStarted, setBattleStarted] = useState(false);

  // Initiative order ve tur bilgileri
  const [initiativeOrder, setInitiativeOrder] = useState([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);

  // Yeni eklenen state'ler: Spell panel görünürlüğü ve seçilen büyü
  const [showSpellPanel, setShowSpellPanel] = useState(false);
  const [selectedSpell, setSelectedSpell] = useState(null);

  // Saldırı seçimi: seçilen saldırgan, saldırı modu ve saldırı türü ("melee", "ranged" veya "spell")
  const [selectedAttacker, setSelectedAttacker] = useState(null);
  const [attackMode, setAttackMode] = useState(false);
  const [attackType, setAttackType] = useState(null);

  // reachableCells artık saldırı menzili (attack range) olarak hesaplanacak
  const [reachableCells, setReachableCells] = useState(new Set());

  // Chat log ve hareket animasyonu
  const [chatLog, setChatLog] = useState([]);
  const [moving, setMoving] = useState(false);

  const currentUserId = parseInt(localStorage.getItem("user_id") || '0', 10);

  // Seçilen saldırı türüne göre reachableCells hesaplanır
  useEffect(() => {
    if (selectedAttacker && attackType) {
      let attackerIndex = null;
      for (let key in placements) {
        if (placements[key] && Number(placements[key].id) === Number(selectedAttacker.id)) {
          attackerIndex = Number(key);
          break;
        }
      }
      if (attackerIndex === null) return;
      const attackerRow = Math.floor(attackerIndex / gridSize);
      const attackerCol = attackerIndex % gridSize;
      const newAttackReachable = new Set();
      if (attackType === "melee") {
        // Yakın dövüş: sadece yanındaki hücreler
        for (let i = 0; i < totalCells; i++) {
          const row = Math.floor(i / gridSize);
          const col = i % gridSize;
          if ((row === attackerRow && Math.abs(col - attackerCol) === 1) ||
              (col === attackerCol && Math.abs(row - attackerRow) === 1)) {
            newAttackReachable.add(i);
          }
        }
      } else if (attackType === "ranged") {
        // Ranged: 5x5 alan, merkez hariç
        for (let i = 0; i < totalCells; i++) {
          const row = Math.floor(i / gridSize);
          const col = i % gridSize;
          if (Math.abs(row - attackerRow) <= 2 && Math.abs(col - attackerCol) <= 2 && (row !== attackerRow || col !== attackerCol)) {
            newAttackReachable.add(i);
          }
        }
      } else if (attackType === 'spell') {
        // Örneğin, spell menzili için 5 hücrelik alan
        const newAttackReachable = new Set();
        const spellRange = 5;
        for (let i = 0; i < totalCells; i++) {
          const row = Math.floor(i / gridSize);
          const col = i % gridSize;
          const distance = Math.abs(row - attackerRow) + Math.abs(col - attackerCol);
          if (distance <= spellRange) {
            newAttackReachable.add(i);
          }
        }
        setReachableCells(newAttackReachable);
        return;
      }
      setReachableCells(newAttackReachable);
    } else if (selectedAttacker) {
      // Hareket menzili hesaplama
      let attackerIndex = null;
      for (let key in placements) {
        if (placements[key] && Number(placements[key].id) === Number(selectedAttacker.id)) {
          attackerIndex = Number(key);
          break;
        }
      }
      if (attackerIndex === null) return;
      const attackerRow = Math.floor(attackerIndex / gridSize);
      const attackerCol = attackerIndex % gridSize;
      const dex = selectedAttacker.dexterity || 10;
      const movementRange = 2 + Math.floor((dex - 10) / 2);
      const newReachable = new Set();
      for (let i = 0; i < totalCells; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        const distance = Math.abs(row - attackerRow) + Math.abs(col - attackerCol);
        if (distance <= movementRange) {
          newReachable.add(i);
        }
      }
      setReachableCells(newReachable);
    } else {
      setReachableCells(new Set());
    }
  }, [selectedAttacker, placements, attackType]);

  // Yakın dövüş saldırısı fonksiyonu
  const handleMeleeAttack = async (targetCharacter) => {
    if (!selectedAttacker || !targetCharacter) return;
    try {
      const response = await api.post('combat/melee-attack/', {
        attacker_id: selectedAttacker.id,
        target_id: targetCharacter.id,
        lobby_id: lobbyId
      });
      const damage = response.data.damage;
      const targetRemainingHp = response.data.target_remaining_hp;
      const newMessage = `${selectedAttacker.name} ${targetCharacter.name}'e yakın dövüş saldırısı yaptı ve ${damage} hasar verdi (Kalan HP: ${targetRemainingHp}).`;
      const updatedChatLog = [...chatLog, newMessage];
      setChatLog(updatedChatLog);
      socket.send(JSON.stringify({
        event: "battleUpdate",
        lobbyId,
        chatLog: updatedChatLog
      }));
      const stateResponse = await api.get(`battle-state/${lobbyId}/`);
      if (stateResponse.data) {
        setInitiativeOrder(stateResponse.data.initiative_order);
        setPlacements(stateResponse.data.placements);
        setAvailableCharacters(stateResponse.data.available_characters);
        setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
      }
      resetSelection();
    } catch (error) {
      console.error("Yakın dövüş saldırısı sırasında hata:", error);
    }
  };

  // Ranged saldırı fonksiyonu
  const handleRangedAttack = async (targetCharacter) => {
    if (!selectedAttacker || !targetCharacter) return;
    try {
      const response = await api.post('combat/ranged-attack/', {
        attacker_id: selectedAttacker.id,
        target_id: targetCharacter.id,
        lobby_id: lobbyId
      });
      const damage = response.data.damage;
      const targetRemainingHp = response.data.target_remaining_hp;
      const newMessage = `${selectedAttacker.name} ${targetCharacter.name}'e ranged saldırısı yaptı ve ${damage} hasar verdi (Kalan HP: ${targetRemainingHp}).`;
      const updatedChatLog = [...chatLog, newMessage];
      setChatLog(updatedChatLog);
      socket.send(JSON.stringify({
        event: "battleUpdate",
        lobbyId,
        chatLog: updatedChatLog
      }));
      const stateResponse = await api.get(`battle-state/${lobbyId}/`);
      if (stateResponse.data) {
        setInitiativeOrder(stateResponse.data.initiative_order);
        setPlacements(stateResponse.data.placements);
        setAvailableCharacters(stateResponse.data.available_characters);
        setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
      }
      resetSelection();
    } catch (error) {
      console.error("Ranged saldırı sırasında hata:", error);
    }
  };

  // Spell kullanımı fonksiyonu
  const handleSpellCast = async (spellKey, targetCharacter, extraData = {}) => {
    if (!selectedAttacker || !targetCharacter) return;
    try {
      const response = await api.post(`spells/${spellKey}/`, {
        attacker_id: selectedAttacker.id,
        target_id: targetCharacter.id,
        lobby_id: lobbyId,
        ...extraData
      });
      const newMessage = response.data.message;
      const updatedChatLog = [...chatLog, newMessage];
      setChatLog(updatedChatLog);
      socket.send(JSON.stringify({
        event: "battleUpdate",
        lobbyId,
        chatLog: updatedChatLog
      }));
      const stateResponse = await api.get(`battle-state/${lobbyId}/`);
      if (stateResponse.data) {
        setInitiativeOrder(stateResponse.data.initiative_order);
        setPlacements(stateResponse.data.placements);
        setAvailableCharacters(stateResponse.data.available_characters);
        setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
      }
      resetSelection();
    } catch (error) {
      console.error(`Error casting spell ${spellKey}:`, error);
    }
  };

  // handleSpellSelect fonksiyonunu ekleyin
  const handleSpellSelect = (spell) => {
    // Eğer spell nesnesinde slug yoksa, spell.name'den bir slug oluşturuyoruz.
    const slug = spell.slug ? spell.slug : spell.name.toLowerCase().replace(/\s+/g, '-');
    // Seçilen büyü nesnesine slug'u ekliyoruz
    setSelectedSpell({ ...spell, id: slug });
    setAttackType('spell');
    setAttackMode(true);
    setShowSpellPanel(false);
    console.log('Seçilen büyü:', { ...spell, id: slug });
  };

  // Örnek: Magic Missile spell fonksiyonu
  const handleMagicMissile = (target) => handleSpellCast('magic-missile', target);

  // Yardımcı: Seçimleri resetleyen fonksiyon
  const resetSelection = () => {
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setSelectedSpell(null);
    setShowSpellPanel(false);
    setReachableCells(new Set());
  };

  // Battle state polling
  useEffect(() => {
    if (!battleStarted) return;
    const interval = setInterval(async () => {
      try {
        const response = await api.get(`battle-state/${lobbyId}/`);
        if (response.data) {
          if (response.data.battle_end === true) {
            window.location.href = `/endbattle/${lobbyId}`;
            return;
          }
          setInitiativeOrder(response.data.initiative_order);
          setPlacements(response.data.placements);
          setAvailableCharacters(response.data.available_characters);
          setCurrentTurnIndex(response.data.current_turn_index || 0);
          if (response.data.chat_log) setChatLog(response.data.chat_log);
        }
      } catch (error) {
        console.error("Battle state fetch error:", error);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [lobbyId, battleStarted]);
  
  // GM battle başlatma
  const handleStartBattle = async () => {
    if (!isGM) return;
    try {
      const response = await api.post('combat/initiate/', { 
        lobby_id: lobbyId, 
        character_ids: allCharacters.map(ch => ch.id),
        placements,
        available_characters: availableCharacters
      });
      const initOrder = response.data.initiative_order;
      socket.send(JSON.stringify({
        event: "battleStart",
        lobbyId,
        placements,
        availableCharacters,
        initiativeOrder: initOrder
      }));
      console.log("Initiative Order gönderildi:", initOrder);
      setInitiativeOrder(initOrder);
      setCurrentTurnIndex(0);
      setBattleStarted(true);
    } catch (error) {
      console.error("Battle start hatası:", error);
    }
  };

  // GM battle sonlandırma
  const handleEndBattle = async () => {
    try {
      const response = await api.post('combat/end-battle/', { lobby_id: lobbyId });
      console.log("Battle state 'battleEnd' durumuna güncellendi:", response.data);
    } catch (error) {
      console.error("Battle end API çağrısı sırasında hata:", error);
    }
  };
  
  // battleEnd mesajını dinleyen useEffect
  useEffect(() => {
    const battleEndHandler = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "battleEnd" && Number(data.lobbyId) === Number(lobbyId)) {
          window.location.href = `/endbattle/${lobbyId}`;
        }
      } catch (error) {
        console.error("battleEnd mesajı ayrıştırma hatası:", error);
      }
    };
    socket.addEventListener("message", battleEndHandler);
    return () => {
      socket.removeEventListener("message", battleEndHandler);
    };
  }, [lobbyId]);

  // Lobi verilerini çekme
  useEffect(() => {
    const fetchLobbyData = async () => {
      try {
        const response = await api.get(`lobbies/${lobbyId}/`);
        setLobbyData(response.data);
        setIsGM(response.data.gm_player === currentUserId);
      } catch (error) {
        console.error("Lobi verileri alınırken hata:", error);
      }
    };
    if (lobbyId) {
      fetchLobbyData();
    }
  }, [lobbyId, currentUserId]);

  // Tüm karakterleri çekme
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await api.get(`lobbies/${lobbyId}/characters/`);
        setAllCharacters(response.data);
      } catch (error) {
        console.error("Karakterler alınırken hata:", error);
      }
    };
    if (lobbyId) {
      fetchCharacters();
    }
  }, [lobbyId]);

  // Available karakterleri güncelleme
  useEffect(() => {
    const placedIds = Object.values(placements)
      .filter(ch => ch !== undefined)
      .map(ch => ch.id);
    const notPlaced = allCharacters.filter(ch => !placedIds.includes(ch.id));
    setAvailableCharacters(notPlaced);
  }, [allCharacters, placements, lobbyId]);

  // BattleStart mesajlarını dinleme
  useEffect(() => {
    const battleStartHandler = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "battleStart" && Number(data.lobbyId) === Number(lobbyId)) {
          setBattleStarted(true);
          if (data.initiativeOrder) {
            setInitiativeOrder(data.initiativeOrder);
            setCurrentTurnIndex(0);
          }
          if (data.placements) setPlacements(data.placements);
          if (data.availableCharacters) setAvailableCharacters(data.availableCharacters);
          if (data.chatLog) setChatLog(data.chatLog);
        }
      } catch (error) {
        console.error("BattleStart mesajı ayrıştırma hatası:", error);
      }
    };
    socket.addEventListener("message", battleStartHandler);
    return () => {
      socket.removeEventListener("message", battleStartHandler);
    };
  }, [lobbyId]);

  // BattleUpdate mesajlarını dinleme
  useEffect(() => {
    const battleUpdateHandler = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "battleUpdate" && Number(data.lobbyId) === Number(lobbyId)) {
          if (data.placements) setPlacements(data.placements);
          if (data.availableCharacters) setAvailableCharacters(data.availableCharacters);
          if (data.initiativeOrder) setInitiativeOrder(data.initiativeOrder);
          if (data.chatLog) setChatLog(data.chatLog);
        }
      } catch (error) {
        console.error("BattleUpdate mesajı ayrıştırma hatası:", error);
      }
    };
    socket.addEventListener("message", battleUpdateHandler);
    return () => {
      socket.removeEventListener("message", battleUpdateHandler);
    };
  }, [lobbyId]);

  // Hareket için handleMoveCharacter fonksiyonu
  const handleMoveCharacter = async (targetCellIndex) => {
    if (!reachableCells.has(targetCellIndex) || placements[targetCellIndex]) return;
    let currentCell = null;
    for (let key in placements) {
      if (placements[key] && Number(placements[key].id) === Number(selectedAttacker.id)) {
        currentCell = Number(key);
        break;
      }
    }
    if (currentCell === null) return;
    const newPlacements = { ...placements };
    newPlacements[currentCell] = undefined;
    newPlacements[targetCellIndex] = selectedAttacker;
    setPlacements(newPlacements);
    try {
      await api.post('combat/move-character/', { lobby_id: lobbyId, placements: newPlacements });
    } catch (error) {
      console.error("Hareket güncelleme hatası:", error);
    }
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      placements: newPlacements,
    }));
    setMoving(true);
    setTimeout(() => {
      setMoving(false);
      resetSelection();
    }, 500);
  };

  // Drag and Drop işlemleri
  const handleDragStart = (e, character, source, sourceIndex) => {
    const data = { character, source, sourceIndex };
    e.dataTransfer.setData("text/plain", JSON.stringify(data));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, cellIndex) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    let newPlacements = { ...placements };
    if (data.source === "grid" && data.sourceIndex !== undefined) {
      newPlacements[data.sourceIndex] = undefined;
    }
    if (newPlacements[cellIndex]) {
      setAvailableCharacters(prev => [...prev, newPlacements[cellIndex]]);
    }
    newPlacements[cellIndex] = data.character;
    setPlacements(newPlacements);
    if (data.source === "available") {
      setAvailableCharacters(prev => prev.filter(ch => ch.id !== data.character.id));
    }
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      placements: newPlacements,
      availableCharacters: availableCharacters.filter(ch => ch.id !== data.character.id)
    }));
  };

  // Grid hücrelerinin oluşturulması
  const cells = Array.from({ length: totalCells }, (_, index) => {
    const cellCharacter = placements[index];
    return (
      <div
        key={index}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, index)}
        style={{
          border: '1px solid #ccc',
          width: '35px',
          height: '35px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: cellCharacter ? '#90ee90' : '#fff',
          cursor: cellCharacter ? 'pointer' : 'default',
          boxShadow: reachableCells.has(index) ? '0 0 0 2px green' : 'none'
        }}
        onClick={() => {
          // Eğer spell modu aktifse, seçilen büyü ile saldırı yap
          if (attackMode && selectedAttacker && attackType === 'spell' && selectedSpell && cellCharacter) {
            handleSpellCast(selectedSpell.id, cellCharacter);
            return;
          }
          if (attackMode && selectedAttacker && attackType) {
            if (cellCharacter && Number(cellCharacter.player_id) !== Number(selectedAttacker.player_id)) {
              if (attackType === "melee") {
                handleMeleeAttack(cellCharacter);
              } else if (attackType === "ranged") {
                handleRangedAttack(cellCharacter);
              }
              return;
            }
          }
          if (selectedAttacker && !attackMode && !placements[index] && reachableCells.has(index)) {
            handleMoveCharacter(index);
            return;
          }
          if (cellCharacter && initiativeOrder.length > 0) {
            const currentTurn = initiativeOrder[currentTurnIndex];
            if (Number(cellCharacter.player_id) !== Number(currentUserId)) return;
            if (Number(cellCharacter.id) === Number(currentTurn.character_id)) {
              setSelectedAttacker(cellCharacter);
            } else {
              alert("Sıra sizde değil!");
            }
          }
        }}
      >
        {cellCharacter && (
          <div
            draggable={isGM}
            onDragStart={(e) => handleDragStart(e, cellCharacter, "grid", index)}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: '#4CAF50',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              textAlign: 'center',
              padding: '2px',
              border: cellCharacter.player_id === currentUserId ? '2px solid blue' : 'none',
              transition: moving ? 'transform 0.5s ease' : 'none',
              transform: moving ? 'translateY(-10px)' : 'none'
            }}
          >
            {cellCharacter.name}
          </div>
        )}
      </div>
    );
  });

  const handleEndTurn = async () => {
    try {
      const response = await api.post('combat/end-turn/', { lobby_id: lobbyId });
      const newInitiativeOrder = response.data.initiative_order;
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          event: "battleUpdate",
          lobbyId,
          initiativeOrder: newInitiativeOrder,
          placements: response.data.placements
        }));
      }
      setInitiativeOrder(newInitiativeOrder);
    } catch (error) {
      console.error("Turn end error:", error);
    }
  };

  const availableList = availableCharacters.map(ch => (
    <div
      key={ch.id}
      onClick={() => {
        if (attackMode && selectedAttacker && attackType) {
          if (attackType === "melee") {
            handleMeleeAttack(ch);
          } else if (attackType === "ranged") {
            handleRangedAttack(ch);
          } else if (attackType === "spell" && selectedSpell) {
            handleSpellCast(selectedSpell.id, ch);
          }
          return;
        }
        if (Number(ch.player_id) !== Number(currentUserId)) return;
        if (initiativeOrder.length > 0) {
          const currentTurn = initiativeOrder[currentTurnIndex];
          if (Number(ch.id) === Number(currentTurn.character_id)) {
            setSelectedAttacker(ch);
          } else {
            alert("Sıra sizde değil!");
          }
        }
      }}
      draggable={isGM}
      onDragStart={(e) => handleDragStart(e, ch, "available")}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#2196F3',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '5px',
        cursor: 'grab',
        fontSize: '10px',
        textAlign: 'center',
        padding: '2px',
        border: Number(ch.player_id) === Number(currentUserId) ? '2px solid blue' : 'none'
      }}
    >
      {ch.name}
    </div>
  ));

  const renderTurnEndButton = () => {
    return (
      <button 
        onClick={handleEndTurn}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#f44336',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Turn End
      </button>
    );
  };

  // renderActionPanel fonksiyonu: "Büyü Kullan" butonu eklenmiştir.
  const renderActionPanel = () => {
    if (!selectedAttacker) return null;
    const hasSpells =
      selectedAttacker.prepared_spells && selectedAttacker.prepared_spells.length > 0;
    return (
      <div style={{ margin: '20px 0', padding: '10px', border: '1px solid #4CAF50', borderRadius: '4px', backgroundColor: '#e8f5e9' }}>
        <h3>{selectedAttacker.name} - Aksiyon Seçimi</h3>
        {!attackType ? (
          <>
            <button onClick={() => { setAttackType("melee"); setAttackMode(true); }} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
              Yakın Dövüş Saldırı Seç
            </button>
            <button onClick={() => { setAttackType("ranged"); setAttackMode(true); }} style={{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px', cursor: 'pointer' }}>
              Ranged Saldırı Seç
            </button>
            {hasSpells && (
              <button onClick={() => setShowSpellPanel(true)} style={{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px', cursor: 'pointer' }}>
                Büyü Kullan
              </button>
            )}
            <button onClick={() => resetSelection()} style={{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px', cursor: 'pointer' }}>
              İptal
            </button>
          </>
        ) : (
          <p>
            {attackType === "ranged"
              ? "Ranged saldırı modu seçildi; lütfen hedefi seçin."
              : attackType === "melee"
              ? "Yakın dövüş saldırısı modu seçildi; lütfen hedefi seçin."
              : "Büyü saldırısı modu seçildi; lütfen hedefi seçin."}
          </p>
        )}
      </div>
    );
  };

  const renderInitiativeOrder = () => {
    if (initiativeOrder.length === 0) return null;
    return (
      <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#ddd', borderRadius: '4px' }}>
        <strong>Initiative Order:</strong> {initiativeOrder.map((entry, idx) => (
          <span key={entry.character_id} style={{ marginRight: '10px', fontWeight: idx === currentTurnIndex ? 'bold' : 'normal' }}>
            {entry.name} ({entry.initiative})
          </span>
        ))}
      </div>
    );
  };

  const renderChatLog = () => {
    return (
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #aaa', borderRadius: '4px', backgroundColor: '#f0f0f0', maxHeight: '150px', overflowY: 'auto' }}>
        <h4>Chat Log</h4>
        {chatLog.map((msg, idx) => (
          <p key={idx} style={{ margin: '5px 0' }}>{msg}</p>
        ))}
      </div>
    );
  };

  const containerStyle = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh'
  };

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridSize}, 35px)`,
    gridTemplateRows: `repeat(${gridSize}, 35px)`,
    gap: '2px',
    marginBottom: '20px',
    border: '2px solid #333',
    backgroundColor: '#fff',
    padding: '5px'
  };

  const availableContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: '20px'
  };

  if (!lobbyData) {
    return <div style={{ padding: '20px' }}>Lobi bilgileri yükleniyor...</div>;
  }

  return (
    <div style={containerStyle}>
      <h2>Battle Area</h2>
      {renderInitiativeOrder()}
      {battleStarted ? (
        <div style={gridContainerStyle}>
          {cells}
        </div>
      ) : (
        <>
          {isGM ? (
            <>
              <div style={gridContainerStyle}>
                {cells}
              </div>
              <div>
                <h3>Yerleştirilmeyi Bekleyen Karakterler</h3>
                <div style={availableContainerStyle}>
                  {availableList}
                </div>
              </div>
              <button 
                onClick={handleStartBattle}
                style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Savaşı Başlat
              </button>
            </>
          ) : (
            <p style={{ fontSize: '20px', color: '#555' }}>
              Savaş alanı hazırlanıyor, lütfen bekleyiniz...
            </p>
          )}
        </>
      )}

      {isGM && battleStarted && (
        <button 
          onClick={handleEndBattle}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#673AB7',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Savaşı Sonlandır
        </button>
      )}

      {selectedAttacker && renderActionPanel()}
      {renderTurnEndButton()}
      {renderChatLog()}

      {/* 5. SpellPanel render edilmesi */}
      {showSpellPanel && selectedAttacker && (
        <SpellPanel
        spells={
          selectedAttacker.prepared_spells
            ? selectedAttacker.prepared_spells.map((spell) => ({
                // prepared_spell içinde id yerine, slug veya name kullanılabilir
                id: spell.slug, // veya spell.name, backend'inizin beklediğine göre
                name: spell.name
              }))
            : []
        }
        onSpellSelect={handleSpellSelect}
      />
      )}
    </div>
  );
};

export default Battle;

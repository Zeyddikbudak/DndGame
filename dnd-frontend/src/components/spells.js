// components/spells.js

import api from '../services/api';
import socket from '../services/socket';

// Magic Missile için oluşturduğumuz fonksiyon
export const handleMagicMissile = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/magic-missile/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { damage } = response.data;
    const newMessage = `${selectedAttacker.name} Magic Missile spellini kullandı ve ${targetCharacter.name}'e ${damage} hasar verdi.`;
    const updatedChatLog = [...chatLog, newMessage];
    setChatLog(updatedChatLog);
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Magic Missile spelli sırasında hata:", error);
  }
};

// Fireball için handleFireball fonksiyonu
export const handleFireball = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/fireball/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    // Fireball spellinde yanıt içerisinden hasar ve diğer bilgiler alınabilir
    const { damage } = response.data;
    const newMessage = `${selectedAttacker.name} Fireball spellini kullandı ve ${targetCharacter.name}'e ${damage} hasar verdi.`;
    const updatedChatLog = [...chatLog, newMessage];
    setChatLog(updatedChatLog);
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Fireball spelli sırasında hata:", error);
  }
};

export const handleLightningBolt = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/lightning-bolt/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { damage } = response.data;
    const newMessage = `${selectedAttacker.name} Lightning Bolt spellini kullandı ve ${targetCharacter.name}'e ${damage} hasar verdi.`;
    const updatedChatLog = [...chatLog, newMessage];
    setChatLog(updatedChatLog);
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Lightning Bolt spelli sırasında hata:", error);
  }
};

export const handleHealingWord = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/healing-word/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    // API yanıtında heal_amount ve target_new_hp bilgileri dönebilir.
    const { heal_amount, target_new_hp } = response.data;
    const newMessage = `${selectedAttacker.name} Healing Word spellini kullandı ve ${targetCharacter.name}'in HP'sini ${heal_amount} iyileştirdi (Yeni HP: ${target_new_hp}).`;
    const updatedChatLog = [...chatLog, newMessage];
    setChatLog(updatedChatLog);
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Healing Word spelli sırasında hata:", error);
  }
};

export const handleShield = async (
  selectedAttacker,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker) return;
  try {
    const response = await api.post('spells/shield/', {
      attacker_id: selectedAttacker.id,
      lobby_id: lobbyId,
    });
    // API'den dönen mesajı alıyoruz (örneğin, "X Shield spellini kullandı; ek koruma sağlandı.")
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Shield spelli sırasında hata:", error);
  }
};

export const handleInvisibility = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/invisibility/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Invisibility spelli sırasında hata:", error);
  }
};

export const handleSleepSpell = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/sleep/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    // API yanıtı, Sleep Spell kullanıldığında tipik olarak bir mesaj içerir.
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    // Socket üzerinden battle state güncellemesi gönderiyoruz
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    // Güncel battle state'i API'den çekip UI'yı güncelliyoruz.
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    // Büyü kullanımı sonrası UI durumlarını resetliyoruz.
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Sleep spelli sırasında hata:", error);
  }
};

export const handleAcidArrow = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    // Acid Arrow spelli için API'ye POST isteği gönderiliyor.
    const response = await api.post('spells/acid-arrow/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    // API yanıtında hasar bilgisi dönebilir.
    const { damage } = response.data;
    // Örneğin, sunucuda oluşturulan mesaj:
    const newMessage = `${selectedAttacker.name} Acid Arrow spellini kullandı ve ${targetCharacter.name}'e ${damage} hasar verdi.`;
    const updatedChatLog = [...chatLog, newMessage];
    setChatLog(updatedChatLog);
    
    // Socket üzerinden battleUpdate mesajı broadcast ediliyor.
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    // Güncel battle state'i API'den çekiyoruz ve ilgili UI state'leri güncelliyoruz.
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    // Kullanılan büyü sonrası UI durumlarını sıfırlıyoruz.
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Acid Arrow spelli sırasında hata:", error);
  }
};

export const handleMagicWeapon = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    // API isteği, Magic Weapon endpoint'ine POST edilir.
    const response = await api.post('spells/magic-weapon/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    // API yanıtında büyüye özgü mesaj döner.
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    // Socket üzerinden battle state güncellemesi broadcast ediliyor.
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    // Güncel battle state API üzerinden çekiliyor ve UI güncelleniyor.
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    // Büyü kullanımı sonrası ilgili state'ler sıfırlanıyor.
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Magic Weapon spelli sırasında hata:", error);
  }
};

export const handleFlySpell = async (
  selectedAttacker,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  // Bu büyüde sadece saldırıyı yapan karakter (caster) kullanıyor,
  // dolayısıyla hedef karakter bilgisine gerek yok.
  if (!selectedAttacker) return;
  try {
    // API'ye, Fly spellini uygulamak için POST isteği gönderilir.
    const response = await api.post('spells/fly/', {
      attacker_id: selectedAttacker.id,
      lobby_id: lobbyId,
    });
    // API yanıtında, büyünün etkisini anlatan bir mesaj döner.
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    // Socket üzerinden güncellenmiş battle state mesajı tüm oyunculara gönderilir.
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    // API üzerinden güncel battle state çekilerek UI state'leri güncellenir.
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    // Büyü kullanıldıktan sonra saldırı ile ilgili state'ler resetlenir.
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Fly spelli sırasında hata:", error);
  }
};

export const handleConeOfCold = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    // API'ye POST isteği gönderilerek Cone of Cold spellinin uygulanması tetikleniyor.
    const response = await api.post('spells/cone-of-cold/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    // Yanıttan hasar bilgisi alınır.
    const { damage } = response.data;
    const newMessage = `${selectedAttacker.name} Cone of Cold spellini kullandı ve ${targetCharacter.name}'e ${damage} hasar verdi.`;
    const updatedChatLog = [...chatLog, newMessage];
    setChatLog(updatedChatLog);
    
    // Socket üzerinden battle state güncellemesi broadcast edilir.
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    // Güncel battle state'i API üzerinden çekerek UI güncellenir.
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    // Büyü kullanımı sonrası saldırı ile ilgili state'ler sıfırlanır.
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Cone of Cold spelli sırasında hata:", error);
  }
};

export const handleDominatePerson = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    // API'ye POST isteği gönderilerek Dominate Person spellinin uygulanması tetikleniyor.
    const response = await api.post('spells/dominate-person/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    // Sunucudan dönen yanıt mesajı alınır.
    const { message } = response.data;
    // Chat log güncellenir.
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    // Socket üzerinden battle state güncellemesi tüm oyunculara broadcast edilir.
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    // API üzerinden güncel battle state çekilir ve UI güncellemeleri yapılır.
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    // Kullanılan büyü sonrası saldırı ile ilgili state'ler sıfırlanır.
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Dominate Person spelli sırasında hata:", error);
  }
};

export const handleDisintegrate = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    // API'ye POST isteği gönderiliyor: Disintegrate spellini uygulamak için
    const response = await api.post('spells/disintegrate/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    // Sunucudan dönen yanıtta, hesaplanan hasar, hedefin kalan HP'si ve oluşturulan mesaj bulunuyor.
    const { damage, target_remaining_hp, message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    // Socket üzerinden battle state güncellemesi broadcast ediliyor.
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    // Güncel battle state'i API'den çekip UI'yı güncelliyoruz.
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    // Büyü kullanımı sonrasında ilgili UI durumları resetlenir.
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Disintegrate spelli sırasında hata:", error);
  }
};


export const handleEarthquake = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    // API'ye POST isteği gönderilerek Earthquake spelli uygulanıyor.
    const response = await api.post('spells/earthquake/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    
    // Sunucudan dönen yanıtta hesaplanan hasar değeri alınır.
    const { damage } = response.data;
    const newMessage = `${selectedAttacker.name} Earthquake spellini kullandı ve ${targetCharacter.name}'e ${damage} hasar verdi.`;
    const updatedChatLog = [...chatLog, newMessage];
    setChatLog(updatedChatLog);
    
    // Socket üzerinden battle state güncellemesi broadcast edilir.
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    // API üzerinden güncel battle state çekilir ve UI state'leri güncellenir.
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    // Kullanım sonrası saldırı ile ilgili state'ler resetlenir.
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Earthquake spelli sırasında hata:", error);
  }
};
export const handleHoldPerson = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    // API isteği gönderiliyor: Hold Person spellini uygulamak için.
    const response = await api.post('spells/hold-person/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    // Sunucudan dönen yanıtın içinde, hold person etkisini açıklayan bir mesaj var.
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    // Socket üzerinden battle state güncellemesi broadcast ediliyor.
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    // Güncel battle state API'den çekilerek UI state'leri güncelleniyor.
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    // Büyü kullanımı sonrası saldırı ile ilgili state'ler resetleniyor.
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Hold Person spelli sırasında hata:", error);
  }
};
export const handleLightningStorm = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    // API isteği gönderilir: Lightning Storm spellinin uygulanması için
    const response = await api.post('spells/lightning-storm/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    
    // API yanıtından hesaplanan hasar alınır.
    const { damage } = response.data;
    // Örneğin, sunucudan dönen mesaj: "X Lightning Storm spellini kullandı ve Y'e Z hasar verdi."
    const newMessage = `${selectedAttacker.name} Lightning Storm spellini kullandı ve ${targetCharacter.name}'e ${damage} hasar verdi.`;
    const updatedChatLog = [...chatLog, newMessage];
    setChatLog(updatedChatLog);
    
    // Socket üzerinden battle state güncellemesi tüm oyunculara broadcast edilir.
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    // Güncel battle state API'den çekilir ve UI durumları güncellenir.
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    // Büyü kullanımı sonrasında saldırı ile ilgili tüm state'ler sıfırlanır.
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Lightning Storm spelli sırasında hata:", error);
  }
};
export const handlePolymorph = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    // API'ye POST isteği gönderilerek Polymorph spellinin uygulanması tetikleniyor.
    const response = await api.post('spells/polymorph/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    // Sunucudan dönen yanıtta, Polymorph etkisini açıklayan mesaj alınır.
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    // Socket üzerinden battle state güncellemesi tüm oyunculara broadcast edilir.
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    // Güncel battle state API'den çekilerek UI state'leri güncellenir.
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    // Büyü kullanımı sonrası saldırı ile ilgili state'ler resetlenir.
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Polymorph spelli sırasında hata:", error);
  }
};
export const handleSunbeam = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    // Sunbeam spellini uygulamak için API'ye POST isteği gönderiyoruz.
    const response = await api.post('spells/sunbeam/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    // API yanıtından dönen hasar değerini alıyoruz.
    const { damage } = response.data;
    // Sunbeam spellinin etkisini açıklayan mesajı oluşturuyoruz.
    const newMessage = `${selectedAttacker.name} Sunbeam spellini kullandı ve ${targetCharacter.name}'e ${damage} hasar verdi.`;
    const updatedChatLog = [...chatLog, newMessage];
    setChatLog(updatedChatLog);

    // Socket üzerinden battle state güncellemesi tüm oyunculara broadcast ediliyor.
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));

    // API üzerinden güncel battle state'i çekip UI state'lerini güncelliyoruz.
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }

    // Büyü kullanımı sonrası saldırı ile ilgili state'ler resetleniyor.
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Sunbeam spelli sırasında hata:", error);
  }
};
export const handleWallOfFire = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    // Wall of Fire spellini uygulamak için API'ye POST isteği gönderiyoruz.
    const response = await api.post('spells/wall-of-fire/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    // API yanıtında dönen hasar ve mesaj bilgilerini alıyoruz.
    const { damage } = response.data;
    const newMessage = `${selectedAttacker.name} Wall of Fire spellini kullandı ve ${targetCharacter.name}'e ${damage} hasar verdi.`;
    const updatedChatLog = [...chatLog, newMessage];
    setChatLog(updatedChatLog);
    
    // Socket üzerinden battle state güncellemesi tüm oyunculara gönderiliyor.
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    // Güncel battle state'i API'den çekip UI state'lerini güncelliyoruz.
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    // Büyü kullanımı sonrası saldırı ile ilgili state'ler resetleniyor.
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Wall of Fire spelli sırasında hata:", error);
  }
};
export const handleTimeStop = async (
  selectedAttacker,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker) return;
  try {
    // Time Stop spellini uygulamak için API'ye POST isteği gönderiyoruz.
    const response = await api.post('spells/time-stop/', {
      attacker_id: selectedAttacker.id,
      lobby_id: lobbyId,
    });
    
    // API yanıtından dönen mesajı alıyoruz.
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    // Socket üzerinden battle state güncellemesi tüm oyunculara broadcast ediliyor.
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    // Güncel battle state'i API'den çekip UI durumlarını güncelliyoruz.
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    // Büyü kullanımı sonrasında saldırı ile ilgili state'ler resetleniyor.
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Time Stop spelli sırasında hata:", error);
  }
};
export const handleBlight = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    // API'ye POST isteği gönderilerek Blight spellinin uygulanması tetikleniyor.
    const response = await api.post('spells/blight/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    // API yanıtından dönen hasar değeri alınır.
    const { damage } = response.data;
    // Blight spellinin etkisini açıklayan mesaj oluşturuluyor.
    const newMessage = `${selectedAttacker.name} Blight spellini kullandı ve ${targetCharacter.name}'e ${damage} necrotic hasar verdi (Kalan HP: ${response.data.target_remaining_hp}).`;
    const updatedChatLog = [...chatLog, newMessage];
    setChatLog(updatedChatLog);
    
    // Socket üzerinden battle state güncellemesi tüm oyunculara gönderiliyor.
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    // Güncel battle state API üzerinden çekilip UI güncellemeleri yapılıyor.
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    // Büyü kullanımı sonrası saldırı ile ilgili state'ler resetleniyor.
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Blight spelli sırasında hata:", error);
  }
};
export const handleCharmPerson = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/charm-person/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Charm Person spelli sırasında hata:", error);
  }
};
export const handleDarkness = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/darkness/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Darkness spelli sırasında hata:", error);
  }
};
export const handleHaste = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/haste/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Haste spelli sırasında hata:", error);
  }
};
export const handleSlow = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/slow/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Slow spelli sırasında hata:", error);
  }
};
export const handleCounterspell = async (
  selectedAttacker,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  // Counterspell, hedef karakter gerektirmez; saldırıyı yapan karakterin (attacker) büyü girişimini engeller.
  if (!selectedAttacker) return;
  try {
    const response = await api.post('spells/counterspell/', {
      attacker_id: selectedAttacker.id,
      lobby_id: lobbyId,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Counterspell spelli sırasında hata:", error);
  }
};
export const handleFireShield = async (
  selectedAttacker,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  // Fire Shield büyüsünde sadece saldırıyı yapan karakter kullanılıyor; hedef gerekmiyor.
  if (!selectedAttacker) return;
  try {
    const response = await api.post('spells/fire-shield/', {
      attacker_id: selectedAttacker.id,
      lobby_id: lobbyId,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    // Kullanım sonrası UI reset
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Fire Shield spelli sırasında hata:", error);
  }
};
export const handlePrismaticSpray = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/prismatic-spray/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { damage } = response.data;
    const newMessage = `${selectedAttacker.name} Prismatic Spray spellini kullandı ve ${targetCharacter.name}'e ${damage} hasar verdi.`;
    const updatedChatLog = [...chatLog, newMessage];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Prismatic Spray spelli sırasında hata:", error);
  }
};
export const handleDispelMagic = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/dispel-magic/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Dispel Magic spelli sırasında hata:", error);
  }
};
export const handleAnimateDead = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/animate-dead/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Animate Dead spelli sırasında hata:", error);
  }
};
export const handleBanishment = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/banishment/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Banishment spelli sırasında hata:", error);
  }
};
export const handleCircleOfDeath = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/circle-of-death/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { damage } = response.data;
    const newMessage = `${selectedAttacker.name} Circle of Death spellini kullandı ve ${targetCharacter.name}'e ${damage} hasar verdi.`;
    const updatedChatLog = [...chatLog, newMessage];
    setChatLog(updatedChatLog);
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Circle of Death spelli sırasında hata:", error);
  }
};
export const handleCloudkill = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/cloudkill/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { damage } = response.data;
    const newMessage = `${selectedAttacker.name} Cloudkill spellini kullandı ve ${targetCharacter.name}'e ${damage} poison hasarı verdi.`;
    const updatedChatLog = [...chatLog, newMessage];
    setChatLog(updatedChatLog);
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Cloudkill spelli sırasında hata:", error);
  }
};

export const handleConfusion = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/confusion/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Confusion spelli sırasında hata:", error);
  }
};

export const handleDelayedBlastFireball = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/delayed-blast-fireball/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { damage } = response.data;
    const newMessage = `${selectedAttacker.name} Delayed Blast Fireball spellini kullandı ve ${targetCharacter.name}'e ${damage} hasar verdi.`;
    const updatedChatLog = [...chatLog, newMessage];
    setChatLog(updatedChatLog);
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Delayed Blast Fireball spelli sırasında hata:", error);
  }
};

export const handleDimensionDoor = async (
  selectedAttacker,
  lobbyId,
  destination, // Hedef konum (örneğin "x,y" formatında)
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  // Bu büyüde sadece saldırıyı yapan karakter (caster) kullanılır, hedef karakter gerekmez.
  if (!selectedAttacker || !destination) return;
  try {
    const response = await api.post('spells/dimension-door/', {
      attacker_id: selectedAttacker.id,
      lobby_id: lobbyId,
      destination, // Hedef konum bilgisi gönderilir.
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);

    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));

    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    // Kullanım sonrasında saldırı ile ilgili tüm state'ler resetlenir.
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Dimension Door spelli sırasında hata:", error);
  }
};

export const handleDominateMonster = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/dominate-monster/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);

    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));

    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Dominate Monster spelli sırasında hata:", error);
  }
};

export const handleFeeblemind = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/feeblemind/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Feeblemind spelli sırasında hata:", error);
  }
};
export const handleTrueResurrection = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/true-resurrection/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("True Resurrection spelli sırasında hata:", error);
  }
};

export const handleForcecage = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/forcecage/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Forcecage spelli sırasında hata:", error);
  }
};

export const handleTelekinesis = async (
  selectedAttacker,
  targetCharacter,
  destination, // Hedefin taşınacağı yeni konum (örneğin "x,y")
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  // Telekinesis spellinde, hem saldırıyı yapan hem de hedef karakter kullanılır; ayrıca hedefin taşınacağı konum bilgisi gönderilir.
  if (!selectedAttacker || !targetCharacter || !destination) return;
  try {
    const response = await api.post('spells/telekinesis/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
      destination, // Hedefin yeni konumu
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    // UI reset
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Telekinesis spelli sırasında hata:", error);
  }
};
export const handleEarthbind = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  // Earthbind spellinde, saldırıyı yapan (attacker) ve hedef karakter (target) bilgileri gönderilir.
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/earthbind/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Earthbind spelli sırasında hata:", error);
  }
};

export const handleMindBlank = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  // Mind Blank spellinde, saldırıyı yapan ve hedef karakter bilgileri API’ye gönderilir.
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/mind-blank/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Mind Blank spelli sırasında hata:", error);
  }
};

export const handleMaze = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  // Maze spellinde, saldırıyı yapan ve hedef karakter bilgileri API’ye gönderilir.
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/maze/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Maze spelli sırasında hata:", error);
  }
};
export const handlePowerWordKill = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  // Power Word Kill spellinde, saldırıyı yapan ve hedef karakter bilgileri API’ye gönderilir.
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/power-word-kill/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Power Word Kill spelli sırasında hata:", error);
  }
};

export const handleGlobeOfInvulnerability = async (
  selectedAttacker,
  lobbyId,
  duration, // Örneğin "1 tur" gibi süre bilgisi
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  // Bu büyü, saldırıyı yapan karakterin (caster) üzerindeki büyü etkilerine karşı geçici koruma sağlar.
  if (!selectedAttacker || !duration) return;
  try {
    const response = await api.post('spells/globe-of-invulnerability/', {
      attacker_id: selectedAttacker.id,
      lobby_id: lobbyId,
      duration, // Koruma süresi
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    // UI reset
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Globe of Invulnerability spelli sırasında hata:", error);
  }
};

export const handleOttosIrresistibleDance = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  // Bu büyü, saldırıyı yapan karakterin (attacker) ve hedef karakterin bilgilerini kullanarak, hedefin kontrolünü geçici olarak kaybetmesine yol açar.
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post("spells/ottos-irresistible-dance/", {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Otto's Irresistible Dance spelli sırasında hata:", error);
  }
};

export const handleSymbol = async (
  selectedAttacker,
  area, // Büyünün etki alanı (örneğin bir alan adı veya koordinat bilgisi)
  effect, // Uygulanacak etki (örneğin "paralize", "korku" vb.)
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  // Symbol büyüsünde yalnızca saldırıyı yapan karakter kullanılır; ayrıca etki alanı ve efekt bilgisi gönderilir.
  if (!selectedAttacker || !area || !effect) return;
  try {
    const response = await api.post('spells/symbol/', {
      attacker_id: selectedAttacker.id,
      lobby_id: lobbyId,
      area,
      effect,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    // UI reset
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Symbol spelli sırasında hata:", error);
  }
};

export const handleMassHeal = async (
  selectedAttacker,
  targetCharacter, // Bu örnekte tek bir hedef kullanılıyor; ileride birden çok hedefe uygulanabilir.
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  // Mass Heal, saldırıyı yapan karakterin ve hedefin bilgilerini kullanarak hedefin HP'sini iyileştirir.
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/mass-heal/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { heal, target_new_hp } = response.data;
    const newMessage = `${selectedAttacker.name} Mass Heal spellini kullandı ve ${targetCharacter.name}'in HP'sini ${heal} iyileştirdi (Yeni HP: ${target_new_hp}).`;
    const updatedChatLog = [...chatLog, newMessage];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if (stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch (error) {
    console.error("Mass Heal spelli sırasında hata:", error);
  }
};

export const handleChainLightning = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  // Chain Lightning spelli, saldırıyı yapan karakterin (attacker) ve hedefin bilgileriyle API’ye gönderilir.
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/chain-lightning/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { damage } = response.data;
    const newMessage = `${selectedAttacker.name} Chain Lightning spellini kullandı ve ${targetCharacter.name}'e ${damage} hasar verdi.`;
    const updatedChatLog = [...chatLog, newMessage];
    setChatLog(updatedChatLog);

    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));

    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if(stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch(error) {
    console.error("Chain Lightning spelli sırasında hata:", error);
  }
};

export const handleReverseGravity = async (
  selectedAttacker,
  lobbyId,
  area, // Etki alanı bilgisi (örneğin, koordinat veya alan adı)
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  // Reverse Gravity spellinde yalnızca saldırıyı yapan karakter ve etki alanı bilgisi kullanılır.
  if (!selectedAttacker || !area) return;
  try {
    const response = await api.post('spells/reverse-gravity/', {
      attacker_id: selectedAttacker.id,
      lobby_id: lobbyId,
      area,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if(stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch(error) {
    console.error("Reverse Gravity spelli sırasında hata:", error);
  }
};

export const handleFleshToStone = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  // Flesh to Stone spellinde, saldırıyı yapan ve hedef karakter bilgileri API’ye gönderilir.
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/flesh-to-stone/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if(stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch(error) {
    console.error("Flesh to Stone spelli sırasında hata:", error);
  }
};

export const handleAnimateObjects = async (
  selectedAttacker,
  lobbyId,
  objectDescription, // Canlandırılacak nesnelerin açıklaması
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  // Animate Objects spellinde, saldırıyı yapan karakter ve nesne açıklaması API’ye gönderilir.
  if (!selectedAttacker || !objectDescription) return;
  try {
    const response = await api.post('spells/animate-objects/', {
      attacker_id: selectedAttacker.id,
      lobby_id: lobbyId,
      object_description: objectDescription,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if(stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch(error) {
    console.error("Animate Objects spelli sırasında hata:", error);
  }
};

export const handleAntimagicField = async (
  selectedAttacker,
  lobbyId,
  area, // Antimagic Field etkisinin uygulanacağı alan (örneğin koordinat veya bölge adı)
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  // Antimagic Field spellinde, saldırıyı yapan karakter ve etki alanı bilgisi API’ye gönderilir.
  if (!selectedAttacker || !area) return;
  try {
    const response = await api.post('spells/antimagic-field/', {
      attacker_id: selectedAttacker.id,
      lobby_id: lobbyId,
      area,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if(stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch(error) {
    console.error("Antimagic Field spelli sırasında hata:", error);
  }
};

export const handleEyebite = async (
  selectedAttacker,
  targetCharacter,
  lobbyId,
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  // Eyebite spellinde saldırıyı yapan ve hedef karakter bilgileri API’ye gönderilir.
  // Bu büyü, hedefin zihinsel durumunu etkileyerek, korku ya da sersemlik gibi durumları tetikleyebilir.
  if (!selectedAttacker || !targetCharacter) return;
  try {
    const response = await api.post('spells/eyebite/', {
      attacker_id: selectedAttacker.id,
      target_id: targetCharacter.id,
      lobby_id: lobbyId,
      // İsteğe bağlı: etki türünü (örneğin "fear" veya "stun") gönderebilirsiniz.
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if(stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    // UI reset
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch(error) {
    console.error("Eyebite spelli sırasında hata:", error);
  }
};

export const handleControlWeather = async (
  selectedAttacker,
  lobbyId,
  newWeather, // Örneğin "clear", "stormy", "foggy" gibi değerler
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  // Control Weather büyüsünde, yalnızca saldırıyı yapan karakter kullanılır ve hava durumu bilgisi gönderilir.
  if (!selectedAttacker || !newWeather) return;
  try {
    const response = await api.post('spells/control-weather/', {
      attacker_id: selectedAttacker.id,
      lobby_id: lobbyId,
      new_weather: newWeather,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if(stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    // UI reset
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch(error) {
    console.error("Control Weather spelli sırasında hata:", error);
  }
};

export const handleHolyAura = async (
  selectedAttacker,
  lobbyId,
  duration, // Örneğin "1 tur"
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  // Holy Aura büyüsünde, saldırıyı yapan karakter kullanılır; ayrıca koruma süresi (duration) gönderilir.
  if (!selectedAttacker || !duration) return;
  try {
    const response = await api.post('spells/holy-aura/', {
      attacker_id: selectedAttacker.id,
      lobby_id: lobbyId,
      duration,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if(stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    // UI reset
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch(error) {
    console.error("Holy Aura spelli sırasında hata:", error);
  }
};

export const handleWish = async (
  selectedAttacker,
  lobbyId,
  wishText, // Oyuncunun dilemek istediği metin (örneğin, "Tüm düşmanlar yok oldu")
  setChatLog,
  chatLog,
  setInitiativeOrder,
  setPlacements,
  setAvailableCharacters,
  setCurrentTurnIndex,
  setSelectedAttacker,
  setAttackMode,
  setAttackType,
  setReachableCells
) => {
  // Wish spellinde, saldırıyı yapan karakterin bilgileri ve oyuncunun dileği (wishText) API’ye gönderilir.
  if (!selectedAttacker || !wishText) return;
  try {
    const response = await api.post('spells/wish/', {
      attacker_id: selectedAttacker.id,
      lobby_id: lobbyId,
      wish_text: wishText,
    });
    const { message } = response.data;
    const updatedChatLog = [...chatLog, message];
    setChatLog(updatedChatLog);
    
    socket.send(JSON.stringify({
      event: "battleUpdate",
      lobbyId,
      chatLog: updatedChatLog,
    }));
    
    const stateResponse = await api.get(`battle-state/${lobbyId}/`);
    if(stateResponse.data) {
      setInitiativeOrder(stateResponse.data.initiative_order);
      setPlacements(stateResponse.data.placements);
      setAvailableCharacters(stateResponse.data.available_characters);
      setCurrentTurnIndex(stateResponse.data.current_turn_index || 0);
    }
    
    // UI reset
    setSelectedAttacker(null);
    setAttackMode(false);
    setAttackType(null);
    setReachableCells(new Set());
  } catch(error) {
    console.error("Wish spelli sırasında hata:", error);
  }
};


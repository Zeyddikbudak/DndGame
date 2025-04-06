import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const EndBattle = () => {
  // URL'den lobby_id parametresini alıyoruz
  const { lobby_id } = useParams();

  // Battle istatistiklerini tutacak state
  const [battleStats, setBattleStats] = useState(null);

  // Mevcut kullanıcının ID'si
  const currentUserId = parseInt(localStorage.getItem("user_id") || '0', 10);

  // GM (Game Master) ID'si
  const [gmId, setGmId] = useState(null);

  useEffect(() => {
    // Battle state'i almak için istek atan fonksiyon
    const fetchBattleStats = async () => {
      try {
        // /battle-state/<lobby_id>/ endpointine istek atıyoruz
        const res = await api.get(`battle-state/${lobby_id}/`);
        setBattleStats(res.data);
      } catch (error) {
        console.error("Battle state alınamadı:", error);
      }
    };

    // Lobby verilerini almak için istek atan fonksiyon
    const fetchLobbyData = async () => {
      try {
        // /lobbies/<lobby_id>/ endpointine istek atıyoruz
        const res = await api.get(`lobbies/${lobby_id}/`);
        setGmId(res.data.gm_player);
      } catch (error) {
        console.error("Lobby verileri alınamadı:", error);
      }
    };

    // Component yüklendiğinde iki fonksiyonu da çağırıyoruz
    fetchBattleStats();
    fetchLobbyData();
  }, [lobby_id]);

  // "Devam Et" butonuna basıldığında, eğer currentUser GM ise GodPanel'e, değilse PlayerPage'e yönlendiriyoruz
  const handleContinue = () => {
    if (currentUserId === gmId) {
      window.location.href = '/godpanel';
    } else {
      window.location.href = '/playerpage';
    }
  };

  // Battle state verisi henüz gelmediyse yükleniyor mesajı göster
  if (!battleStats) {
    return <div>İstatistikler yükleniyor...</div>;
  }

  // Battle state geldiğinde ekrana basit bir JSON formatında gösteriyoruz
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Savaş Bitti!</h2>
      <div>
        <h3>İstatistikler:</h3>
        <pre>{JSON.stringify(battleStats, null, 2)}</pre>
      </div>
      <button 
        onClick={handleContinue} 
        style={{ padding: '10px 20px', marginTop: '20px' }}
      >
        Devam Et
      </button>
    </div>
  );
};

export default EndBattle;

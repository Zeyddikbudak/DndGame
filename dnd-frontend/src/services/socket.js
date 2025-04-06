// services/socket.js
let lobbyId = localStorage.getItem('lobbyId') || 6;
let socket;

export function connect() {
  socket = new WebSocket(`ws://localhost:8000/ws/lobby/${lobbyId}/`);
  socket.onopen = () => {
    console.log("WebSocket bağlantısı kuruldu, lobby id:", lobbyId);
    // Her 30 saniyede bir 'ping' mesajı göndererek bağlantıyı canlı tutun
    setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ event: "ping" }));
        console.log("Ping gönderildi");
      }
    }, 30000);
  };
  socket.onclose = (e) => {
    console.warn("WebSocket bağlantısı kapandı, yeniden bağlanılıyor...", e);
    setTimeout(() => {
      connect();
    }, 3000);
  };
  socket.onerror = (error) => {
    console.error("WebSocket hatası:", error);
  };
}

export function getSocket() {
  return socket;
}

connect();
export default socket;
export function sendMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.error("WebSocket bağlantısı kapalı, mesaj gönderilemedi:", message);
  }
}
export function setLobbyId(id) {
  lobbyId = id;
  localStorage.setItem('lobbyId', id);
  if (socket) {
    socket.close();
  }
  connect();
}
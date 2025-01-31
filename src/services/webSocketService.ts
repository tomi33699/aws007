import { reactive } from "vue";

let socket: WebSocket | null = null;
let isConnected = false;

export const socketData = reactive({
  bukkData: [] as { timestamp: number; powerp: number; irrad: number }[], 
});

export function initWebSocket(url: string): void {
  if (isConnected) {
    console.warn("⚠️ WebSocket már inicializálva, kihagyás...");
    return;
  }

  console.log("🔌 WebSocket inicializálás...");
  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("✅ WebSocket kapcsolat létrejött");
    isConnected = true;
  };

  socket.onmessage = (event) => {
    try {
      if (!event.data) {
        console.error("⚠️ Üres üzenet érkezett!");
        return;
      }

      const message = JSON.parse(event.data);
      console.log("📡 Új WebSocket üzenet:", message);

      if (message.event === "data_change" && message.details === "uj_bukk_raw_adat") {
        console.log("✅ Új Bükk adat:", message);
        socketData.bukkData.push({
          timestamp: new Date(message.timestamp).getTime(),
          powerp: message.powerp ? parseFloat(message.powerp.toFixed(2)) : 0,
          irrad: message.irrad ? parseFloat(message.irrad.toFixed(2)) : 0,
        });
      }
    } catch (err) {
      console.error("❌ WebSocket parsing error:", err);
    }
  };

  socket.onerror = (error) => {
    console.error("❌ WebSocket hiba:", error);
    isConnected = false;
    setTimeout(() => initWebSocket(url), 5000); // Újracsatlakozás 5 mp múlva
  };

  socket.onclose = () => {
    console.log("⚠️ WebSocket kapcsolat megszakadt");
    isConnected = false;
    setTimeout(() => initWebSocket(url), 5000); // Újracsatlakozás 5 mp múlva
  };
}

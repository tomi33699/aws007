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

  socket = new WebSocket(url);

  socket.onopen = () => {
    isConnected = true;
  };

  socket.onmessage = (event) => {
    try {
      if (!event.data) {
        console.warn("⚠️ Üres WebSocket üzenet érkezett!");
        return;
      }

      const message = JSON.parse(event.data);
      console.log("📡 WebSocket üzenet:", message);

      if (message.event === "data_change" && message.details === "uj_bukk_raw_adat") {
        console.log("✅ Új Bükk adat:", message);

        if (
          message.timestamp &&
          typeof message.timestamp === "string" &&
          message.powerp !== undefined &&
          message.irrad !== undefined
        ) {
          socketData.bukkData.push({
            timestamp: new Date(message.timestamp).getTime(),
            powerp: parseFloat(message.powerp.toFixed(2)),
            irrad: parseFloat(message.irrad.toFixed(2)),
          });
        } else {
          console.warn("⚠️ Hibás formátumú WebSocket adat:", message);
        }
      }
    } catch (err) {
      console.error("❌ WebSocket parsing error:", err);
    }
  };

  socket.onerror = (error) => {
    console.error("❌ WebSocket hiba:", error);
    isConnected = false;
    reconnectWebSocket(url);
  };

  socket.onclose = () => {
    console.warn("⚠️ WebSocket kapcsolat megszakadt");
    isConnected = false;
    reconnectWebSocket(url);
  };
}

function reconnectWebSocket(url: string) {
  console.log("♻️ Újracsatlakozás 5 mp múlva...");
  setTimeout(() => initWebSocket(url), 5000);
}

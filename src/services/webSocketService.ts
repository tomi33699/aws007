import { reactive } from "vue";

let socket: WebSocket | null = null;
let listeners: ((message: any) => void)[] = [];

// Reaktív adat a valós idejű frissítésekhez
export const socketData = reactive({
  bukkData: [] as { timestamp: number; real_powerp: number; avg_irrad: number }[], // Bükk adatok tárolása
});

// WebSocket inicializálása
export function initWebSocket(url: string): void {
  if (socket) {
    console.warn("WebSocket already initialized");
    return;
  }

  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("WebSocket connection established");
  };

  socket.onmessage = (event) => {
    try {
      if (!event.data) {
        console.error("Received empty message");
        return;
      }

      const message = JSON.parse(event.data);
      console.log("Parsed WebSocket message:", message);

      // Bükk adatok kezelése
      if (message.event === "data_change" && message.details.includes("bukk_1min_unregulated")) {
        const newData = {
          timestamp: Date.now(), // Az időbélyeg
          real_powerp: Math.random(), // Cseréld ki az API valódi adatára
          avg_irrad: Math.random(), // Cseréld ki az API valódi adatára
        };
        socketData.bukkData.push(newData);

        // Tartsuk a legutóbbi 100 adatpontot
        if (socketData.bukkData.length > 100) {
          socketData.bukkData.shift();
        }
      }

      // Értesítés a hallgatóknak
      listeners.forEach((listener) => listener(message));
    } catch (err) {
      console.error("WebSocket parsing failed:", err);
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    setTimeout(() => initWebSocket(url), 5000);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
    socket = null;
    listeners = [];
  };
}

export function addWebSocketListener(callback: (message: any) => void): void {
  if (!socket) {
    console.error("WebSocket is not initialized");
    return;
  }
  listeners.push(callback);
}

export function removeWebSocketListener(callback: (message: any) => void): void {
  listeners = listeners.filter((listener) => listener !== callback);
}

export function closeWebSocket(): void {
  if (socket) {
    socket.close();
    socket = null;
  } else {
    console.warn("WebSocket is not open or already closed");
  }
}

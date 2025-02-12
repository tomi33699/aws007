import { useDataStore } from '@/store/dataStore';

class WebSocketService {
  private socket: WebSocket | null = null;
  private eventListeners: { [event: string]: ((data: any) => void)[] } = {};

  constructor(private wsUrl: string) {}

  connect() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return;
    }

    this.socket = new WebSocket(this.wsUrl);

    this.socket.onopen = () => {
      console.log("✅ WebSocket kapcsolat létrejött.");
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("🔔 WebSocket üzenet érkezett:", data); // DEBUG

      // 🔹 Ellenőrizzük, hogy a megfelelő táblák érkeztek-e
      if (data.event === "new_data" && data.data) {
        this.handleNewData(data.data);
      }

      // 🔹 Ha az eseményhez van regisztrált callback, hívjuk meg
      if (data.event && this.eventListeners[data.event]) {
        this.eventListeners[data.event].forEach((callback) => callback(data.data));
      }
    };

    this.socket.onclose = () => {
      console.warn("⚠️ WebSocket kapcsolat megszakadt. Újracsatlakozás...");
      setTimeout(() => this.connect(), 5000);
    };

    this.socket.onerror = (error) => {
      console.error("❌ WebSocket hiba:", error);
    };
  }

  // 🔹 Új API lekérés WebSocket esemény érkezésekor
  private handleNewData(newData: any) {
    const dataStore = useDataStore();

    if (!newData || !newData.table) return;

    // 🔹 Ha a bukk_raw_data vagy halmaj_raw_data érkezik, frissítjük a PV Real-Time adatokat
    if (newData.table === 'bukk_raw_data' || newData.table === 'halmaj_raw_data') {
      console.log(`📡 API frissítés WebSocket esemény miatt: ${newData.table}`);
      dataStore.fetchRealTimeData();
    } else {
      console.log("🔍 WebSocket adat nem releváns:", newData.table);
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  close() {
    this.socket?.close();
  }
}

const wsService = new WebSocketService("wss://eforceapi.hu/ws");
wsService.connect();

export default wsService;

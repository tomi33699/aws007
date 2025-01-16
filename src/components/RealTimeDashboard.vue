<template>
    <div>
      <h1>Valós idejű frissítések</h1>
      <div v-if="realTimeData">
        <p><strong>Értesítés:</strong> {{ realTimeData.event }}</p>
      </div>
      <div v-else>
        <p>Várakozás az adatokra...</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        realTimeData: null, // Ide érkeznek az értesítések
      };
    },
    mounted() {
      this.setupWebSocket(); // WebSocket kapcsolat inicializálása
    },
    methods: {
      setupWebSocket() {
        const socket = new WebSocket("wss://eforceapi.hu/ws");
  
        socket.onopen = () => {
          console.log("WebSocket kapcsolat létrejött");
        };
  
        socket.onmessage = (event) => {
          try {
            this.realTimeData = JSON.parse(event.data); // Érkezett adat feldolgozása
            console.log("Valós idejű adat:", this.realTimeData);
          } catch (e) {
            console.error("Hiba az érkező adat feldolgozásakor:", e);
          }
        };
  
        socket.onclose = () => {
          console.warn("WebSocket kapcsolat lezárva. Újrakapcsolódás...");
          setTimeout(this.setupWebSocket, 5000); // Automatikus újrakapcsolódás
        };
  
        socket.onerror = (error) => {
          console.error("WebSocket hiba:", error);
        };
      },
    },
  };
  </script>
  
  <style scoped>
  h1 {
    color: #333;
  }
  p {
    font-size: 16px;
  }
  </style>
  
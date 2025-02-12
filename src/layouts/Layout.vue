<template>
    <div>
      <Navbar />
      <div class="container-fluid">
        <div class="row">
          <Sidebar class="col-md-3 col-lg-2 d-md-block bg-light sidebar" />
          <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <slot />
            <div v-if="productionData.length" class="mt-4">
              <h2 class="text-center">PV Production Summary</h2>
              <div class="row">
                <div class="col-md-4" v-for="(data, index) in productionData" :key="index">
                  <div class="card text-center p-3 shadow-sm">
                    <h5 class="card-title">{{ data.plant }}</h5>
                    <p class="card-text fw-bold">{{ data.production_kwh }} kWh</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Sidebar from "@/components/Sidebar.vue";
  import Navbar from "@/components/Navbar.vue";
  import { ref, onMounted, onUnmounted } from 'vue';
  
  export default {
    components: {
      Sidebar,
      Navbar,
    },
    setup() {
      const productionData = ref([]);
      let socket;
  
      const connectWebSocket = () => {
        socket = new WebSocket("wss://your-api-server.com/realtime");
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.endpoint === "pv_production_summary") {
            productionData.value = data.payload;
          }
        };
      };
  
      onMounted(connectWebSocket);
      onUnmounted(() => socket && socket.close());
  
      return { productionData };
    },
  };
  </script>
  
  <style>
  .sidebar {
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
  }
  .card {
    background-color: #f8f9fa;
    border-radius: 10px;
    margin: 10px 0;
  }
  </style>
  
<template>
  <div class="chart-view">
    <h2>
      Bükk Chart
      <p class="last-updated">Last updated: {{ lastUpdated }}</p>
    </h2>
    <label for="date-picker-bukk">Choose a date for Bükk:</label>
    <input
      id="date-picker-bukk"
      type="date"
      v-model="selectedDate"
      @change="handleDateChange"
    />
    <div v-if="isLoading" class="loading-overlay">
      <span class="loader"></span>
    </div>
    <apexchart
      type="line"
      height="400"
      :options="chartOptions"
      :series="chartData"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { fetchBukkData } from "@/services/apiService";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    const selectedDate = ref(new Date().toISOString().split("T")[0]); // Default to today
    const chartData = ref([]);
    const isLoading = ref(false);
    const lastUpdated = ref("Never"); // Kezdőérték: "Never"
    let refreshInterval = null;

    const chartOptions = ref({
      chart: {
        type: "line",
        zoom: { enabled: false },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 500,
          dynamicAnimation: {
            enabled: true,
            speed: 1000, // **Lágy mozgás frissítéskor**
          },
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          formatter: (value) => {
            return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          },
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
    });

    const fetchBukkDataForDate = async () => {
      try {
        const response = await fetchBukkData(selectedDate.value);
        if (!response || response.length === 0) {
          chartData.value = [];
          return;
        }

        chartData.value = [
          {
            name: "Real PowerP",
            type: "line",
            color: "#5B51BF",
            data: response.map((item) => ({
              x: new Date(item.bucket).getTime(),
              y: parseFloat(item.real_powerp.toFixed(2)),
            })),
          },
          {
            name: "Avg Irrad",
            type: "line",
            color: "#FAC107",
            data: response.map((item) => ({
              x: new Date(item.bucket).getTime(),
              y: parseFloat(item.avg_irrad.toFixed(2)),
            })),
          },
        ];

        // **Frissítés időpont beállítása**
        lastUpdated.value = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

      } catch (error) {
        console.error("Error fetching Bükk data:", error);
      }
    };

    onMounted(() => {
      fetchBukkDataForDate();

      // **Percenkénti frissítés**
      refreshInterval = setInterval(() => {
        console.log("🔄 Automatikus frissítés...");
        fetchBukkDataForDate();
      }, 60000);
    });

    // **Időzítő leállítása, ha a komponens elhagyja a DOM-ot**
    onUnmounted(() => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    });

    return {
      selectedDate,
      chartData,
      chartOptions,
      isLoading,
      lastUpdated,
      handleDateChange: fetchBukkDataForDate,
    };
  },
};
</script>

<style scoped>
.chart-view {
  padding: 1em;
  position: relative;
  background-color: #ffffff;
  border-radius: 10px;
  min-height: 30em;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 0.5em;
  color: #333333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.last-updated {
  font-size: 14px;
  color: #777777;
  margin-left: 10px;
}

label {
  margin-right: 10px;
}

input[type="date"] {
  margin-bottom: 20px;
  padding: 5px;
  font-size: 16px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

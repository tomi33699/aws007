<template>
  <div class="chart-view">
    <h2>
      Bükk Chart
      <p class="last-updated">Utoljára frissítve: {{ lastUpdated }}</p>
    </h2>

    <label for="date-picker-bukk">Dátumválasztás:</label>
    <input
      id="date-picker-bukk"
      type="date"
      v-model="selectedDate"
      @change="fetchBukkDataForDate"
    />

    <!-- 📈 Chart -->
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
    const selectedDate = ref(new Date().toISOString().split("T")[0]); // Default today
    const chartData = ref([
      { name: "Real PowerP", data: [] },
      { name: "Avg Irrad", data: [] },
    ]);
    const lastUpdated = ref("Nincs adat");
    let refreshInterval = null;

    const chartOptions = ref({
      chart: {
        type: "line",
        zoom: { enabled: false },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 500,
          dynamicAnimation: { enabled: true, speed: 1000 },
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          formatter: (value) =>
            new Date(value).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
        },
      },
      yaxis: [
        {
          title: { text: "Real PowerP (kW)" },
          labels: {
            formatter: (value) => `${value} kW`,
          },
        },
        {
          opposite: true,
          title: { text: "Avg Irrad (W/m²)" },
          labels: {
            formatter: (value) => `${value} W/m²`,
          },
        },
      ],
      tooltip: {
        shared: true,
        intersect: false,
      },
    });

    const fetchBukkDataForDate = async () => {
      try {
        const response = await fetchBukkData(selectedDate.value);
        if (!response || response.length === 0) {
          chartData.value = [
            { name: "Real PowerP", data: [] },
            { name: "Avg Irrad", data: [] },
          ];
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
            yaxisIndex: 1, // **⬅️ Külön Y tengelyen**
          },
        ];

        lastUpdated.value = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      } catch (error) {
        console.error("Hiba történt a Bükk adatlekérés közben:", error);
      }
    };

    onMounted(() => {
      fetchBukkDataForDate();
      refreshInterval = setInterval(() => {
        fetchBukkDataForDate();
      }, 60000);
    });

    onUnmounted(() => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    });

    return {
      selectedDate,
      chartData,
      chartOptions,
      lastUpdated,
      fetchBukkDataForDate,
    };
  },
};
</script>

<style scoped>
.chart-view {
  padding: 1em;
  background-color: #ffffff;
  border-radius: 10px;
  min-height: 30em;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  overflow-x: hidden;
}

h2 {
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.last-updated {
  font-size: 14px;
  color: #777;
}

label {
  margin-right: 10px;
}

input[type="date"] {
  margin-bottom: 20px;
  padding: 5px;
  font-size: 16px;
}
</style>

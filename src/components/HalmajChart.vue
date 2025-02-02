<template>
  <div class="chart-view">
    <h2>Halmaj Chart</h2>
    <label for="date-picker-halmaj">Dátumválasztás:</label>
    <input
      id="date-picker-halmaj"
      type="date"
      v-model="selectedDate"
      @change="fetchHalmajDataForDate"
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
import { fetchHalmajData } from "@/services/apiService";
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
    let refreshInterval = null;
    const chartOptions = ref({
      chart: {
        type: "line",
        zoom: { enabled: false },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 300,
          dynamicAnimation: { enabled: true, speed: 1200 },
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
    const fetchHalmajDataForDate = async () => {
      try {
        const response = await fetchHalmajData(selectedDate.value);
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
      } catch (error) {
        console.error("Hiba történt a Halmaj adatlekérés közben:", error);
      }
    };
    onMounted(() => {
      fetchHalmajDataForDate();
      refreshInterval = setInterval(() => {
        fetchHalmajDataForDate();
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
      fetchHalmajDataForDate,
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
}
label {
  margin-right: 10px;
}
input[type="date"] {
  margin-bottom: 20px;
  padding: 5px;
  font-size: 16px;
}


@media screen and (max-width: 768px) {
 .chart-view{
  padding: 1em 0;
}
h2{
  margin-bottom: 1em;
}
}
</style>

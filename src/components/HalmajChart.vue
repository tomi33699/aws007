<template>
    <div class="chart-view">
      <h2>Halmaj Chart</h2>
      <label for="date-picker-halmaj">Choose a date for Halmaj:</label>
      <input
        id="date-picker-halmaj"
        type="date"
        v-model="selectedDate"
        @change="handleDateChange"
      />
      <div v-if="isLoading" class="loading-overlay">
        <span class="loader"></span>
      </div>
      <div v-else>
        <apexchart
          v-if="chartData.length > 0"
          type="line"
          height="400"
          :options="chartOptions"
          :series="chartData"
        />
        <p v-else>No data available for the selected date.</p>
      </div>
    </div>
  </template>

  <script>
  import { ref, onMounted } from "vue";
  import VueApexCharts from "vue3-apexcharts";
  import { fetchHalmajData } from "@/services/apiService";

  export default {
    components: {
      apexchart: VueApexCharts,
    },
    setup() {
      const selectedDate = ref(new Date().toISOString().split("T")[0]); // Default to today
      const chartData = ref([]);
      const isLoading = ref(false);

      const chartOptions = ref({
        chart: {
          type: "line",
          zoom: { enabled: false },
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 500,
          },
        },
        xaxis: {
          type: "datetime",
          categories: [],
          labels: {
            formatter: (value) => {
              const date = new Date(value);
              return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            },
          },
        },
        yaxis: [
          {
            title: { text: "" },
            labels: {
              formatter: (value) => `${value} kW`,
            },
          },
          {
            opposite: true,
            title: { text: "" },
            labels: {
              formatter: (value) => `${value} kW/m²`,
            },
          },
        ],
        legend: {
          show: true,
          markers: {
            width: 12,
            height: 12,
          },
        },
        tooltip: {
          shared: true,
          intersect: false,
        },
      });

      const fetchHalmajDataForDate = async () => {
        isLoading.value = true;
        try {
          const response = await fetchHalmajData(selectedDate.value);

          if (!response || response.length === 0) {
            console.warn("No data found for the selected date.");
            chartData.value = [];
          } else {
            chartData.value = [
              {
                name: "Real PowerP",
                type: "line",
                color: "#5B51BF", // Termelés színe
                data: response.map((item) => ({
                  x: new Date(item.bucket).getTime(),
                  y: parseFloat(item.real_powerp.toFixed(2)),
                })),
              },
              {
                name: "Avg Irrad",
                type: "line",
                color: "#FAC107", // Irradiáció színe
                data: response.map((item) => ({
                  x: new Date(item.bucket).getTime(),
                  y: parseFloat(item.avg_irrad.toFixed(2)),
                })),
              },
            ];
          }
        } catch (error) {
          console.error("Error fetching Halmaj data:", error);
        } finally {
          isLoading.value = false;
        }
      };

      onMounted(fetchHalmajDataForDate);

      return {
        selectedDate,
        chartData,
        chartOptions,
        isLoading,
        handleDateChange: fetchHalmajDataForDate,
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
    box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.1);
  }

  h2 {
    margin-bottom: 1em;
    color: #333333;
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

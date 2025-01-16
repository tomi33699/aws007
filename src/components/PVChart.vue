<template>
    <div class="chart-view">
      <h2>PV Chart</h2>
      <label for="date-picker-pv">Choose a date:</label>
      <input
        id="date-picker-pv"
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
  import { fetchHalmajData, fetchBukkData } from "@/services/apiService";

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
            title: { text: "Sum Real PowerP (kW)" },
            labels: {
              formatter: (value) => `${value} kW`,
            },
          },
          {
            
            opposite: true,
            title: { text: "Sum Avg Irrad (kW/m²)" },
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

      const fetchPVDataForDate = async () => {
        isLoading.value = true;
        try {
          const [halmajResponse, bukkResponse] = await Promise.all([
            fetchHalmajData(selectedDate.value),
            fetchBukkData(selectedDate.value),
          ]);

          if ((!halmajResponse || halmajResponse.length === 0) && (!bukkResponse || bukkResponse.length === 0)) {
            console.warn("No data found for the selected date.");
            chartData.value = [];
          } else {
            const summedData = halmajResponse.map((halmajItem, index) => {
              const bukkItem = bukkResponse[index] || { real_powerp: 0, avg_irrad: 0 };
              return {
                bucket: halmajItem.bucket,
                sum_real_powerp: parseFloat((halmajItem.real_powerp + bukkItem.real_powerp * -1).toFixed(2)),
                sum_avg_irrad: parseFloat((halmajItem.avg_irrad + bukkItem.avg_irrad).toFixed(2)),
              };
            });

            chartData.value = [
              {
                name: "Sum Real PowerP",
                type: "line",
                color: "#5B51BF", // Termelés színe
                data: summedData.map((item) => ({
                  x: new Date(item.bucket).getTime(),
                  y: item.sum_real_powerp,
                })),
              },
              {
                name: "Sum Avg Irrad",
                type: "line",
                color: "#FAC107", // Irradiáció színe
                data: summedData.map((item) => ({
                  x: new Date(item.bucket).getTime(),
                  y: item.sum_avg_irrad,
                })),
              },
            ];
          }
        } catch (error) {
          console.error("Error fetching PV data:", error);
        } finally {
          isLoading.value = false;
        }
      };

      onMounted(fetchPVDataForDate);

      return {
        selectedDate,
        chartData,
        chartOptions,
        isLoading,
        handleDateChange: fetchPVDataForDate,
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

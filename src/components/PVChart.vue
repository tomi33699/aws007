<template>
  <div class="chart-view">
    <div class="controls">
      <div class="date-container">
        <input
          id="date-picker-pv"
          type="date"
          v-model="selectedDate"
          @change="handleDateChange"
        />
      </div>
      <div class="last-update-time">
        <span>Utolsó adat: </span>
        <strong>{{ lastUpdateTime || 'N/A' }}</strong>
      </div>
      <div class="interval-buttons">
        <button
          @click="setNewInterval(1)"
          :class="{ active: selectedInterval === 1 }"
        >
          1 min
        </button>
        <button
          @click="setNewInterval(5)"
          :class="{ active: selectedInterval === 5 }"
        >
          5 min
        </button>
        <button
          @click="setNewInterval(15)"
          :class="{ active: selectedInterval === 15 }"
        >
          15 min
        </button>
      </div>
      <div class="time-range-buttons">
        <button @click="setTimeRange(1)" :class="{ active: selectedRange === 1 }">1 day</button>
        <button @click="setTimeRange(3)" :class="{ active: selectedRange === 3 }">3 day</button>
        <button @click="setTimeRange(7)" :class="{ active: selectedRange === 7 }">1 week</button>
      </div>
<button class="export-btn" @click="showExportDialog = true">📤 Export</button>
    </div>
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
      <p v-else>Nincs elérhető adat a kiválasztott napra.</p>
    </div>
  </div>
  <div v-if="showExportDialog" class="export-dialog-overlay">
  <div class="export-dialog">
    <h3 class="export-title">📤 Exportálás</h3>
    <div class="export-form">
      <div class="export-field">
        <label>Keletkezési dátum:</label>
        <input type="date" v-model="exportStartDate" class="export-input">
      </div>
      <div class="export-field">
        <label>Végdátum:</label>
        <input type="date" v-model="exportEndDate" class="export-input">
      </div>
      <div class="export-field">
        <label>Intervallum:</label>
        <select v-model="exportInterval" class="export-select">
          <option value="1">1 perc</option>
          <option value="5">5 perc</option>
          <option value="15">15 perc</option>
        </select>
      </div>
    </div>
    <div class="export-actions">
      <button @click="showExportDialog = false" class="cancel-btn">❌ Bezárás</button>
      <button @click="exportData" class="export-btn">📥 Exportálás</button>
    </div>
  </div>
</div>
</template>
<script>
import { ref, onMounted, watch } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { fetchHalmajData, fetchBukkData } from "@/services/apiService";
export default {
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    const selectedDate = ref(new Date().toISOString().split("T")[0]);
    const selectedInterval = ref(1);
    const selectedRange = ref(1);
    const lastUpdateTime = ref("");
    const chartData = ref([]);
    const isLoading = ref(false);
    const showExportDialog = ref(false);
    const exportStartDate = ref(new Date().toISOString().split("T")[0]);
    const exportEndDate = ref(new Date().toISOString().split("T")[0]);
    const exportInterval = ref(1);
    const chartOptions = ref({
      chart: {
        type: "line",
        zoom: { enabled: true, allowMouseWheelZoom: false },
        toolbar: { tools: { zoom: false, zoomin: false, zoomout: false, pan: false, reset: true } },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 500,
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          formatter: (value) => new Date(value).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" }),
        },
      },
      yaxis: [
        {
          title: { text: "Portfólió aktuális termelés (kW)" },
          labels: {
            formatter: (value) => `${value.toFixed(2)} kW`,
          },
        },
        {
          opposite: true,
          title: { text: "Portfólió aktuális besugárzás (W/m²)" },
          labels: {
            formatter: (value) => `${value.toFixed(2)} W/m²`,
          },
        },
      ],
    });
    const aggregateData = (data, interval) => {
  if (interval === 1 || data.length === 0) return data; // Ha 1 perces, vagy nincs adat, nincs mit aggregálni

  const aggregated = [];
  let tempBucket = [];
  let lastTimestamp = new Date(data[0].bucket).getTime();

  data.forEach((item) => {
    const currentTimestamp = new Date(item.bucket).getTime();
    
    if (currentTimestamp - lastTimestamp < interval * 60 * 1000) {
      tempBucket.push(item);
    } else {
      if (tempBucket.length > 0) {
        const avgPower = tempBucket.reduce((sum, d) => sum + d.sum_real_powerp, 0) / tempBucket.length;
        const avgIrrad = tempBucket.reduce((sum, d) => sum + d.sum_avg_irrad, 0) / tempBucket.length;
        aggregated.push({
          x: lastTimestamp, 
          y: avgPower, 
          yIrrad: avgIrrad
        });
      }
      tempBucket = [item]; 
      lastTimestamp = currentTimestamp;
    }
  });

  // Utolsó csoport hozzáadása
  if (tempBucket.length > 0) {
    const avgPower = tempBucket.reduce((sum, d) => sum + d.sum_real_powerp, 0) / tempBucket.length;
    const avgIrrad = tempBucket.reduce((sum, d) => sum + d.sum_avg_irrad, 0) / tempBucket.length;
    aggregated.push({
      x: lastTimestamp, 
      y: avgPower, 
      yIrrad: avgIrrad
    });
  }

  return aggregated;
};

    const setNewInterval = (interval) => {
      selectedInterval.value = interval;
      fetchPVDataForRange();
    };
    const setTimeRange = (days) => {
      selectedRange.value = days;
      fetchPVDataForRange();
    };
    const fetchPVDataForRange = async () => {
      isLoading.value = true;
      let allData = [];
      try {
        for (let i = 0; i < selectedRange.value; i++) {
          let date = new Date(selectedDate.value);
          date.setDate(date.getDate() - i);
          let formattedDate = date.toISOString().split("T")[0];
          const [halmajResponse, bukkResponse] = await Promise.all([
            fetchHalmajData(formattedDate, selectedInterval.value),
            fetchBukkData(formattedDate, selectedInterval.value),
          ]);
          let data = halmajResponse.map((halmajItem, index) => {
            const bukkItem = bukkResponse[index] || {};
            return {
              bucket: halmajItem.bucket,
              sum_real_powerp: (halmajItem.real_powerp || 0) + (bukkItem.real_powerp || 0),
              sum_avg_irrad: (halmajItem.avg_irrad || 0) + (bukkItem.avg_irrad || 0),
            };
          });
          allData = [...data, ...allData];
        }
        if (allData.length > 0) {
          lastUpdateTime.value = new Date(allData[allData.length - 1].bucket).toLocaleString("hu-HU", {
            month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"
          });
        }
        chartData.value = [
          {
            name: "Portfólió aktuális termelés (kW)",
            type: "line",
            color: "#5B51BF",
            data: allData.map(item => ({
              x: new Date(item.bucket).getTime(),
              y: item.sum_real_powerp,
            })),
          },
          {
            name: "Portfólió aktuális besugárzás (W/m²)",
            type: "line",
            color: "#FAC107",
            data: allData.map(item => ({
              x: new Date(item.bucket).getTime(),
              y: item.sum_avg_irrad,
            })),
          },
        ];
      } finally {
        isLoading.value = false;
      }
    };
    const exportCSVData = () => {
      let csvContent = "Időpont;Termelés (kW);Besugárzás (W/m²)\n";
      chartData.value[0].data.forEach((point, index) => {
        const timestamp = new Date(point.x).toLocaleString("hu-HU", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        });
        csvContent += `${timestamp};${point.y.toFixed(2)};${chartData.value[1].data[index].y.toFixed(2)}\n`;
      });
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `export_${exportStartDate.value}_${exportEndDate.value}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    const exportData = () => {
      exportCSVData();
      showExportDialog.value = false;
    };
    watch(selectedDate, () => {
      fetchPVDataForRange();
    });
    onMounted(fetchPVDataForRange);
    return {
      selectedDate,
      selectedInterval,
      selectedRange,
      lastUpdateTime,
      chartData,
      chartOptions,
      isLoading,
      setNewInterval,
      setTimeRange,
      fetchPVDataForRange,
      showExportDialog,
      exportStartDate,
      exportEndDate,
      exportInterval,
      exportData,
    };
  },
};
</script>
  <style scoped>
  .chart-view {
    padding: 0 1em;
    position: relative;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.1);
    text-align: left;
  }
  h2 {
    margin-bottom: 1em;
    color: #333333;
  }
  label {
    margin-right: 10px;
  }
  input[type="date"] {
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
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(5px);
}

.loader {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #4A90E2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.controls {
  display: flex;
  padding: 1em 0;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
  justify-content: space-between;
}
.interval-buttons button {
  background-color: #f3f3f3;
  border: 1px solid #ccc;
  padding: 5px 10px;
  cursor: pointer;
}
.interval-buttons button.active {
  background-color: #5B51BF;
  color: white;
}
.export-btn {
  background-color: #fac107;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-weight: bold;
  border-radius: 5px;
}
.time-range-buttons button {
  background-color: #f3f3f3;
  border: 1px solid #ccc;
  padding: 5px 10px;
  cursor: pointer;
}
.time-range-buttons button.active {
  background-color: #5B51BF;
  color: white;
}
.export-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: black;
  color: white;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
.export-dialog-overlay {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0, 0, 0, 0.5);
display: flex;
align-items: center;
justify-content: center;
z-index: 1000;
}
.export-dialog {
background: #ffffff;
color: #333;
padding: 20px;
border-radius: 12px;
box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
width: 320px;
text-align: center;
}
.export-title {
font-size: 1.2em;
font-weight: bold;
margin-bottom: 10px;
}
.export-form {
display: flex;
flex-direction: column;
gap: 12px;
}
.export-field {
display: flex;
flex-direction: column;
align-items: flex-start;
}
.export-input, .export-select {
width: 100%;
padding: 8px;
border: 1px solid #ccc;
border-radius: 6px;
font-size: 14px;
}
.export-actions {
display: flex;
justify-content: space-between;
margin-top: 15px;
}
.export-btn {
background-color: #5B51BF;
color: white;
padding: 8px 12px;
border: none;
border-radius: 6px;
cursor: pointer;
font-weight: bold;
transition: background 0.3s;
}
.export-btn:hover {
background-color: #0056b3;
}
.cancel-btn {
background-color: #ff4d4d;
color: white;
padding: 8px 12px;
border: none;
border-radius: 6px;
cursor: pointer;
font-weight: bold;
transition: background 0.3s;
}
.cancel-btn:hover {
background-color: #cc0000;
}
  </style>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getForecastData } from '@/services/apiService';
import VueApexCharts from 'vue3-apexcharts';

const selectedDate = ref(new Date().toISOString().slice(0, 10));
const forecastData = ref<any[]>([]);

const fetchForecastData = async () => {
  try {
    console.log("📡 Fetching forecast data for:", selectedDate.value);
    const response = await getForecastData(selectedDate.value);
    forecastData.value = response || [];
  } catch (error) {
    console.error('❌ Error fetching forecast data:', error);
  }
};

onMounted(() => {
  fetchForecastData();
});

// ** Chart adatok előkészítése **
const chartOptions = {
  chart: {
    id: 'forecast-chart',
    zoom: {
      enabled: false, // Manuális zoom engedélyezése
      type: 'x',
      autoScaleYaxis: true,
      enabledOnWheel: false // 🔹 Görgős zoom kikapcsolása
    },
    toolbar: {
      tools: {
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: false,
        reset: true
      }
    }
  },
  stroke: { width: 2 },
  xaxis: {
    type: 'datetime',
    labels: { format: 'HH:mm' }
  },
  yaxis: { title: { text: 'Előrejelzett Termelés (kW)' } },
  tooltip: {
    shared: true,
    x: { format: 'HH:mm' }
  }
};


const prepareForecastData = computed(() => [
  {
    name: 'Halmajugra - 00:00',
    data: forecastData.value.map((item: any) => ({
      x: new Date(item.timestamp).getTime(),
      y: item.today_0000_halmajugra || 0,
    })),
  },
  {
    name: 'Halmajugra - 06:00',
    data: forecastData.value.map((item: any) => ({
      x: new Date(item.timestamp).getTime(),
      y: item.today_0600_halmajugra || 0,
    })),
  },
  {
    name: 'Halmajugra - 12:00',
    data: forecastData.value.map((item: any) => ({
      x: new Date(item.timestamp).getTime(),
      y: item.today_1200_halmajugra || 0,
    })),
  },
  {
    name: 'Halmajugra - 18:00',
    data: forecastData.value.map((item: any) => ({
      x: new Date(item.timestamp).getTime(),
      y: item.today_1800_halmajugra || 0,
    })),
  },
  {
    name: 'Bükkábrány - 00:00',
    data: forecastData.value.map((item: any) => ({
      x: new Date(item.timestamp).getTime(),
      y: item.today_0000_bukkabrany || 0,
    })),
  },
  {
    name: 'Bükkábrány - 06:00',
    data: forecastData.value.map((item: any) => ({
      x: new Date(item.timestamp).getTime(),
      y: item.today_0600_bukkabrany || 0,
    })),
  },
  {
    name: 'Bükkábrány - 12:00',
    data: forecastData.value.map((item: any) => ({
      x: new Date(item.timestamp).getTime(),
      y: item.today_1200_bukkabrany || 0,
    })),
  },
  {
    name: 'Bükkábrány - 18:00',
    data: forecastData.value.map((item: any) => ({
      x: new Date(item.timestamp).getTime(),
      y: item.today_1800_bukkabrany || 0,
    })),
  }
]);

</script>

<template>
  <div>
    <h2>Előrejelzett Termelés</h2>
    <label for="date-picker">Válassz dátumot:</label>
    <input id="date-picker" type="date" v-model="selectedDate" @change="fetchForecastData" />

    <VueApexCharts type="line" height="350" :options="chartOptions" :series="prepareForecastData" />
  </div>
</template>

  
  
  <style scoped>
  .forecast-container {
    margin: 20px;
  }
  
  .chart-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .chart-box {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  </style>
  
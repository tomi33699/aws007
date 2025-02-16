<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { apiService } from '@/services/apiService';
import type { HUPXData } from '@/types/apiService';

const selectedDate = ref(new Date().toISOString().split('T')[0]);
const hupxData = ref<HUPXData[]>([]);

const fetchData = async () => {
  try {
    const { data: hupxPrices } = await apiService.getHUPXData(selectedDate.value);
    

    hupxData.value = hupxPrices.map(item => ({
      timestamp: new Date(item.timestamp).toLocaleTimeString("hu-HU", {
        hour: '2-digit', minute: '2-digit'
      }), // HH:MM formátum
      price: parseFloat(item.price.toFixed(2))  // 2 tizedesre kerekítve
    }));
  } catch (error) {
    console.error("🚨 Hiba történt a HUPX adatok lekérésekor:", error);
  }
};

onMounted(fetchData);
watch(selectedDate, async () => {
  await fetchData();
});

const chartOptions = computed(() => ({
  chart: {
    type: 'line',  // 🔹 Vonaldiagram típusa
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 500,
    },
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    }
  },
  stroke: {
    width: 4,
    curve: 'stepline',
  },
  colors: ['#3b82f6'],
 
  xaxis: {
    categories: hupxData.value.map(item => item.timestamp),
    labels: {
      rotate: -45,
    },
  },
  yaxis: {
    title: { text: 'HUPX Ár (EUR/MWh)' },
  },
  tooltip: {
    x: {
      format: 'HH:mm'
    }
  },
  legend: {
    position: 'top',
  }
}));

const series = computed(() => [
  {
    name: "HUPX Ár (EUR/MWh)",
    type: 'line',  // 🔹 Vonal típus
    data: hupxData.value.map(item => item.price),
  }
]);
</script>

<template>
  <div>
    <label for="datePicker">Válassz dátumot:</label>
    <input id="datePicker" type="date" v-model="selectedDate" @change="fetchData" />
    <VueApexCharts type="line" :options="chartOptions" :series="series" height="400" />
  </div>
</template>

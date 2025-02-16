<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { apiService } from '@/services/apiService';
import type { BalancingPriceData } from '@/types/apiService';

const selectedDate = ref(new Date().toISOString().split('T')[0]);
const balancingData = ref<BalancingPriceData[]>([]);

const fetchData = async () => {
  try {
    const { data: balancingPrices } = await apiService.getBalancingActivatedPrice(selectedDate.value);
    
    // Adatok átalakítása
    balancingData.value = balancingPrices.map(item => ({
      timestamp: new Date(item.timestamp).toLocaleTimeString("hu-HU", {
        hour: '2-digit', minute: '2-digit'
      }), // Helyes dátum formázás
      up_price: parseFloat((item.up_price / 1000).toFixed(0)),   // Ezerrel osztva
      down_price: parseFloat((item.down_price / 1000).toFixed(0)) // Ezerrel osztva
    }));
  } catch (error) {
    console.error("🚨 Hiba történt az adatok lekérésekor:", error);
  }
};

onMounted(fetchData);
watch(selectedDate, async () => {
  await fetchData();
});

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
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
    width: 1,
  },
  colors: ['#3b82f6', '#FF4560'],
  dataLabels: {
    enabled: balancingData.value.length < 30, // Csak akkor engedélyezve, ha az adatok száma kevesebb, mint 30
    style: {
      fontSize: '10px',
      colors: ['#333']
    }
  },
  xaxis: {
    categories: balancingData.value.map(item => item.timestamp),
    labels: {
      rotate: -45,
    },
  },
  yaxis: {
    title: { text: 'Balancing Ár (EUR/MWh ezerrel osztva)' },
  },
  legend: {
    position: 'top',
  }
}));

const series = computed(() => [
  {
    name: "Up Price (EUR/MWh)",
    type: 'column',
    data: balancingData.value.map(item => item.up_price),
  },
  {
    name: "Down Price (EUR/MWh)",
    type: 'column',
    data: balancingData.value.map(item => item.down_price),
  }
]);
</script>

<template>
  <div>
    <label for="datePicker">Válassz dátumot:</label>
    <input id="datePicker" type="date" v-model="selectedDate" @change="fetchData" />
    <VueApexCharts type="bar" :options="chartOptions" :series="series" height="400" />
  </div>
</template>

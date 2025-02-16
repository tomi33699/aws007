<template>
  <div>
    <VueApexCharts type="line" :options="chartOptions" :series="series" height="400" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const props = defineProps<{ 
  total1MinData: { timestamp: string; power_kw: number; irrad?: number }[]; 
  interpolatedForecast: number[];
}>();

const tickAmount = computed(() => Math.min(10, Math.max(5, Math.floor(props.total1MinData.length / 30))));

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    animations: { enabled: false },
    zoom: { enabled: false },
    toolbar: { show: false }
  },
  stroke: { width: [2, 2, 1], dashArray: [0, 0, 5] },
  colors: ['#3b82f6', '#facc15', '#22c55e'],
  xaxis: {
    type: 'datetime',
    categories: props.total1MinData.map(item => item.timestamp),
    tickAmount: tickAmount.value,
  },
  yaxis: [
    { title: { text: 'Teljesítmény (kW)' } },
    { opposite: true, title: { text: 'Besugárzás (W/m²)' } },
  ],
  tooltip: { shared: true },
  legend: { show: true }
}));

const series = computed(() => [
  { name: "Összesített Teljesítmény (kW)", data: props.total1MinData.map(item => parseFloat(item.power_kw.toFixed(2))) },
  { name: "Összesített Besugárzás (W/m²)", data: props.total1MinData.map(item => parseFloat((item.irrad ?? 0).toFixed(2))) },
  { name: "Besug forecast (W/m²)", data: props.interpolatedForecast.map(val => parseFloat(val.toFixed(2))) }
]);

</script>

<style scoped>
.chart-placeholder {
  display: none;
}
</style>

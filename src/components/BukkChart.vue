<template>
  <div>
    <VueApexCharts type="line" :options="chartOptions" :series="series" height="400" ref="chartRef" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const props = defineProps<{ 
  bukk1MinData: { timestamp: string; power_kw: number; irrad?: number }[];
}>();

const chartRef = ref<any>(null);
const loading = ref(true);

watch(() => props.bukk1MinData, (newData) => {
  if (newData.length > 0) {
    loading.value = false;
    if (chartRef.value) {
      chartRef.value.updateSeries(series.value);
    }
  }
}, { immediate: true });

const tickAmount = computed(() => Math.max(5, Math.floor(props.bukk1MinData.length / 60)));

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    animations: { enabled: false },
    zoom: { enabled: false },
    toolbar: { show: false }
  },
  stroke: { width: [2, 2] },
  colors: ['#3b82f6', '#facc15'], 
  xaxis: {
    categories: props.bukk1MinData.map(item => new Date(item.timestamp).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })),
    tickAmount: tickAmount.value,
  },
  yaxis: [
    { title: { text: 'Teljesítmény (kW)' } },
    { opposite: true, title: { text: 'Besugárzás (W/m²)' } },
  ],
  tooltip: {
    enabled: true,
    y: {
      formatter: (val: number) => `${val.toFixed(2)}`
    }
  }
}));

const series = computed(() => [
  { name: "Bükkábrány Teljesítmény (kW)", data: props.bukk1MinData.map(item => item.power_kw.toFixed(2)) },
  { name: "Bükkábrány Besugárzás (W/m²)", data: props.bukk1MinData.map(item => (item.irrad ?? 0).toFixed(2)) }
]);
</script>

<style scoped>
.chart-placeholder {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: #666;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>

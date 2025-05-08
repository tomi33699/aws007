<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { apiService } from '@/services/apiService';
import type { AfrrData } from '@/types/apiService';

const afrrData = ref<AfrrData[]>([]);
const selectedDate = ref(new Date().toISOString().slice(0, 10));

const latestStatus = computed(() => {
  if (!afrrData.value.length) return { szab_time: 'N/A', szab_status: 'N/A' };
  const last = afrrData.value[afrrData.value.length - 1];
  return {
    szab_time: last.szab_time,
    szab_status: last.szab_status ?? 'N/A',
  };
});

const fetchAfrrData = async () => {
  try {
    const { data } = await apiService.getAfrrData(selectedDate.value);
    afrrData.value = data;
  } catch (error) {
    console.error("❌ Hiba az aFRR adatok lekérésekor:", error);
  }
};

onMounted(fetchAfrrData);
watch(selectedDate, fetchAfrrData);

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    zoom: { enabled: false }, // 🔍 Zoom kikapcsolva
    toolbar: { show: true }
  },
  xaxis: {
  categories: afrrData.value.map(item =>
    new Date(item.szab_time).toLocaleTimeString('hu-HU', {
      hour: '2-digit',
      minute: '2-digit',
    })
  ),
  title: { text: 'Idő (óra:perc)' },
  labels: { rotate: -45 },
},
  yaxis: {
    title: { text: 'Teljesítmény (MW)' }
  },
  tooltip: {
    shared: true,
    intersect: false,
  },
  stroke: {
    curve: 'smooth',
    width: [1.5, 2.5, 1.5], // 🟥 pmax/pmin vékonyabb, 🟩 pelvi vastagabb
  },
  colors: ['#ff0000', '#22c55e', '#ff0000'], // pmax - piros, pelvi - zöld, pmin - piros
  legend: {
    position: 'top',
  },
}));

const series = computed(() => [
  {
    name: 'Pmax',
    data: afrrData.value.map(item => item.pmax),
  },
  {
    name: 'Pelvi',
    data: afrrData.value.map(item => item.pelvi),
  },
  {
    name: 'Pmin',
    data: afrrData.value.map(item => item.pmin),
  },
]);
</script>

<template>
  <div class="afrr-chart-container">
      <h2 class="text-center">📉 aFRR Teljesítmény adatok</h2>
    <div class="status-card">
      <p><strong>🕒 Utolsó szabályozási idő:</strong> {{ latestStatus.szab_time }}</p>
      <p><strong>📘 Szabályozási státusz:</strong> {{ latestStatus.szab_status }}</p>
    </div>

    <input type="date" id="monthPicker" v-model="selectedDate" />
    <VueApexCharts type="line" :options="chartOptions" :series="series" height="400" />
  </div>
</template>

<style scoped>
.afrr-chart-container {
  width: 100%;
  padding: 1rem;
  margin: 0 auto;
}

.status-card {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-around;
}

.status-card p{
    margin-bottom: 0;
}
</style>

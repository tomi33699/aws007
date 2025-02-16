<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { apiService } from '@/services/apiService';
import type { PowerData } from '@/types/apiService';

const selectedMonth = ref(new Date().toISOString().slice(0, 7));
const bukkDailyData = ref<PowerData[]>([]);
const halmajDailyData = ref<PowerData[]>([]);

const fetchDailyData = async () => {
  const [year, month] = selectedMonth.value.split('-');
  try {
    const { data: bukkData } = await apiService.getBukkDailyData(year, month);
    const { data: halmajData } = await apiService.getHalmajDailyData(year, month);
    
    bukkDailyData.value = bukkData;
    halmajDailyData.value = halmajData;
  } catch (error) {
    console.error("🚨 Hiba történt az adatok lekérésekor:", error);
  }
};

onMounted(fetchDailyData);
watch(selectedMonth, async () => {
  await fetchDailyData();
});

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    stacked: false,
  },
  colors: ['#3b82f6', '#22c55e'], // Bükkábrány kék, Halmajugra sárga
  xaxis: {
    categories: bukkDailyData.value.map(item => item.timestamp),
    labels: {
      rotate: -45, // Jobb olvashatóság miatt elforgatva
    }
  },
  yaxis: {
    title: { text: 'Napi termelés (kWh)' }
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: (val: number) => `${val.toFixed(2)} kWh`
    }
  }
}));

const series = computed(() => [
  {
    name: "Bükkábrány",
    data: bukkDailyData.value.map(item => parseFloat(((item.power_kw ?? 0) / 1000).toFixed(2))),
  },
  {
    name: "Halmajugra",
    data: halmajDailyData.value.map(item => parseFloat(((item.power_kw ?? 0) / 1000).toFixed(2))),
  }
]);
</script>

<template>
  <div class="dailysum-data-cont">
    <h2 class="text-center">📊 Napi termelési adatok</h2>
    <div class="datepickercont-dashboardpage">
      <input id="monthPicker" type="month" v-model="selectedMonth">
    </div>
    <VueApexCharts type="bar" :options="chartOptions" :series="series" height="400" />
  </div>
</template>


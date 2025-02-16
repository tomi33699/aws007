<template>
  <div>
    <WindyMap />
    <WindyWeather/>
    <PvDataCard />
    <div class="datepickercont-dashboardpage">
      <input id="datePicker" type="date" v-model="date">
    </div>
    
    <div class="dashboardpage-totalcontainer">
      <Suspense><LazyPowerChart :total1MinData="total1MinData" :interpolatedForecast="interpolatedForecast" /></Suspense>
      <VueProfil />
   </div>

    <div class="dashboardpage-halmajbukkchartcont">
      <Suspense><LazyBukkChart :bukk1MinData="bukk1MinData" /></Suspense>
      <Suspense><LazyHalmajChart :halmaj1MinData="halmaj1MinData" /></Suspense>
    </div>

    <Suspense><LazyDailyProductionChart /></Suspense>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, defineAsyncComponent } from 'vue';
import { apiService } from '@/services/apiService';
import type { PowerData, ForecastData } from '@/types/apiService';
import PvDataCard from '@/components/PvDataCard.vue';
import WindyMap from '@/components/WindyMap.vue'; // 🔥 ÚJ - Importáld a Windy térképet
import WindyWeather from '@/components/WindyWeather.vue';
import VueProfil from '@/components/VueProfil.vue';

const LazyPowerChart = defineAsyncComponent(() => import('@/components/PowerChart.vue'));
const LazyBukkChart = defineAsyncComponent(() => import('@/components/BukkChart.vue'));
const LazyHalmajChart = defineAsyncComponent(() => import('@/components/HalmajChart.vue'));
const LazyDailyProductionChart = defineAsyncComponent(() => import('@/components/DailyProductionChart.vue'));

const date = ref(new Date().toISOString().split('T')[0]);
const total1MinData = ref<PowerData[]>([]);
const bukk1MinData = ref<PowerData[]>([]);
const halmaj1MinData = ref<PowerData[]>([]);
const forecastData = ref<ForecastData[]>([]);
const interpolatedForecast = ref<number[]>([]);
let fetchInterval: ReturnType<typeof setInterval> | null = null;

const updateIfChanged = <T>(refData: { value: T }, newData: T) => {
  if (JSON.stringify(refData.value) !== JSON.stringify(newData)) {
    refData.value = newData;
  }
};

const fetchData = async () => {
  try {
    const [halmajData, bukkData, forecast] = await Promise.all([
      apiService.getHalmaj1MinData(date.value),
      apiService.getBukk1MinData(date.value),
      apiService.getForecastData(date.value)
    ]);

    updateIfChanged(halmaj1MinData, halmajData.data);
    updateIfChanged(bukk1MinData, bukkData.data);
    updateIfChanged(forecastData, forecast.data);

    total1MinData.value = halmaj1MinData.value.map((item, index) => ({
      timestamp: item.timestamp,
      power_kw: item.power_kw + (bukk1MinData.value[index]?.power_kw ?? 0),
      irrad: (item.irrad ?? 0) + (bukk1MinData.value[index]?.irrad ?? 0),
    }));
    
    interpolateForecast();
  } catch (error) {
    console.error("🚨 Hiba történt az adatok lekérésekor:", error);
  }
};

const interpolateForecast = () => {
  if (!total1MinData.value.length || !forecastData.value.length) return;
  const timestamps = total1MinData.value.map(item => new Date(item.timestamp).getTime());
  const originalForecast = forecastData.value.map(item => ({
    timestamp: new Date(item.timestamp).getTime(),
    value: item.today_1200_bukkabrany
  }));
  
  interpolatedForecast.value = timestamps.map(time => {
    let before = originalForecast.find((item, index) => 
      item.timestamp <= time && (originalForecast[index + 1]?.timestamp ?? Infinity) > time);
    let after = originalForecast.find(item => item.timestamp > time);
    if (!before) return after?.value ?? 0;
    if (!after) return before.value;
    let ratio = (time - before.timestamp) / (after.timestamp - before.timestamp);
    return before.value + ratio * (after.value - before.value);
  });
};

onMounted(() => {
  fetchData();});

watch(date, fetchData);
</script>

<style>
  
@media (max-width: 768px) {
  .dashboardpage-totalcontainer{
    grid-template-columns: 1fr;
  }
}
</style>
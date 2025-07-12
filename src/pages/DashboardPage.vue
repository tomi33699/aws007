<template>
  <div>
    <Loader v-if="loading" />
    <div v-else>
      <WindyMap />
      <WindyWeather />
      <PvDataCard />
      <div>
        <div class="datepickercont-dashboardpage">
          <input id="datePicker" type="date" v-model="date" />
          <button @click="fetchData" class="refresh-button">Frissítés</button>
        </div>
        <div class="dashboardpage-totalcontainer">
          <PowerChart :total1MinData="total1MinData.length ? total1MinData : defaultData" :interpolatedForecast="interpolatedForecast.length ? interpolatedForecast : defaultForecast" />
          <VueProfil />
        </div>
        <div class="dashboardpage-halmajbukkchartcont">
          <BukkChart :bukk1MinData="bukk1MinData.length ? bukk1MinData : defaultData" />
          <HalmajChart :halmaj1MinData="halmaj1MinData.length ? halmaj1MinData : defaultData" />
        </div>
        <VerAfrrChart />
        <VerChart />
        <AfrrChart />
        <DailyProductionChart />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { apiService } from '@/services/apiService';
import type { PowerData, ForecastData } from '@/types/apiService';
import PvDataCard from '@/components/PvDataCard.vue';
import WindyMap from '@/components/WindyMap.vue';
import WindyWeather from '@/components/WindyWeather.vue';
import VueProfil from '@/components/VueProfil.vue';
import PowerChart from '@/components/PowerChart.vue';
import BukkChart from '@/components/BukkChart.vue';
import HalmajChart from '@/components/HalmajChart.vue';
import DailyProductionChart from '@/components/DailyProductionChart.vue';
import Loader from '@/components/Loader.vue';
import AfrrChart from '@/components/AfrrChart.vue';
import VerAfrrChart from '@/components/VerAfrrChart.vue';
import VerChart from '@/components/VerChart.vue';

const date = ref(new Date().toISOString().split('T')[0]);
const total1MinData = ref<PowerData[]>([]);
const bukk1MinData = ref<PowerData[]>([]);
const halmaj1MinData = ref<PowerData[]>([]);
const forecastData = ref<ForecastData[]>([]);
const interpolatedForecast = ref<number[]>([]);
const loading = ref(true);
const defaultData = Array(1000).fill({ timestamp: new Date().toISOString(), power_kw: 0, irrad: 0 });
const defaultForecast = Array(1000).fill(0);

const fetchData = async () => {
  loading.value = true;
  try {
    const [halmaj, bukk, forecast] = await Promise.all([
      apiService.getHalmaj1MinData(date.value),
      apiService.getBukk1MinData(date.value),
      apiService.getForecastData(date.value)
    ]);

    bukk1MinData.value = bukk.data;
    halmaj1MinData.value = halmaj.data;
    forecastData.value = forecast.data;

    requestIdleCallback(() => {
      const worker = new Worker(new URL('@/workers/dataWorker.ts', import.meta.url), { type: 'module' });
      worker.postMessage({ halmajData: halmaj.data, bukkData: bukk.data, forecastData: forecast.data });

      worker.onmessage = (e) => {
        total1MinData.value = e.data.totalData;
        interpolatedForecast.value = e.data.interpolatedForecast;
        loading.value = false;
      };
    });
  } catch (error) {
    console.error('Hiba történt az adatok lekérésekor:', error);
    loading.value = false;
  }
};

onMounted(fetchData);
watch(date, fetchData);
</script>

<style>
.refresh-button {
  margin: 10px;
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.refresh-button:hover {
  background-color: #2563eb;
}

.info-icon {
  margin-left: 8px;
  font-size: 18px;
  color: #3b82f6;
  cursor: pointer;
  position: relative;
}

.info-popup {
  display: none;
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #ebebeb;
  padding: 8px;
  border-radius: 4px;
  font-size: .6em;
  white-space: nowrap;
  font-weight: 500;
}

.info-icon:hover .info-popup {
  display: block;
}

@media (max-width: 768px) {
  .dashboardpage-totalcontainer {
    grid-template-columns: 1fr;
  }
}
</style>
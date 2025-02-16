<template>
  <div class="card-container">
    <div class="cards">
      <!-- Valós idejű teljesítmény -->
      <div class="card">
        <h3 class="card-title"><i class="fas fa-bolt icon"></i> Valós idejű teljesítmény</h3>
        <div class="card-content">
          <div class="card-content-row">
            <div class="data-item">
              <i class="fas fa-map-marker-alt"></i> Bükkábrány:
              <strong>{{ realTimeBukk?.current_power_kw?.toFixed(2) ?? 'N/A' }} kW</strong>
            </div>
            <div class="data-item">
              <i class="fas fa-map-marker-alt"></i> Halmajugra:
              <strong>{{ realTimeHalmaj?.current_power_kw?.toFixed(2) ?? 'N/A' }} kW</strong>
            </div>
            <div class="total-power">
              <i class="fas fa-sun"></i> <strong>{{ totalRealTime?.toFixed(2) ?? 'N/A' }} kW</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Napi termelési adatok -->
      <div class="card">
        <h3 class="card-title"><i class="fas fa-chart-line icon"></i> Napi Termelés</h3>
        <div class="card-content">
          <div class="card-content-row">
            <div class="data-item">
              <i class="fas fa-map-marker-alt"></i> Bükkábrány: <strong>{{ productionBukk?.production_kwh?.toFixed(2) ?? 'N/A' }} MWh</strong>
            </div>
            <div class="data-item">
              <i class="fas fa-map-marker-alt"></i> Halmajugra: <strong>{{ productionHalmaj?.production_kwh?.toFixed(2) ?? 'N/A' }} MWh</strong>
            </div>
            <div class="total-energy">
              <i class="fas fa-battery-full"></i> <strong>{{ totalProduction?.toFixed(2) ?? 'N/A' }} MWh</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Havi termelési adatok -->
      <div class="card">
        <h3 class="card-title"><i class="fas fa-calendar-alt icon"></i> Havi Termelés</h3>
        <div class="card-content">
          <div class="card-content-row">
            <div class="data-item">
              <i class="fas fa-map-marker-alt"></i> Bükkábrány: <strong>{{ monthlyProductionBukk?.toFixed(2) ?? 'N/A' }} kWh</strong>
            </div>
            <div class="data-item">
              <i class="fas fa-map-marker-alt"></i> Halmajugra: <strong>{{ monthlyProductionHalmaj?.toFixed(2) ?? 'N/A' }} kWh</strong>
            </div>
            <div class="total-energy">
              <i class="fas fa-chart-bar"></i> <strong>{{ totalMonthlyProduction?.toFixed(2) ?? 'N/A' }} kWh</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Piaci árak -->
      <div class="card">
        <h3 class="card-title"><i class="fas fa-euro-sign icon"></i> Piaci Árak</h3>
        <div class="card-content">
          <div class="card-content-row">
            <div class="data-item">
              <i class="fas fa-arrow-up"></i>  <strong>{{ balancingUp?.toFixed(2) ?? 'N/A' }} HUF/MWh</strong>
            </div>
            <div class="data-item">
              <i class="fas fa-arrow-down"></i>  <strong>{{ balancingDown?.toFixed(2) ?? 'N/A' }} HUF/MWh</strong>
            </div>
            <div class="data-item">
              <i class="fas fa-chart-line"></i>  <strong>{{ hupxAvg?.toFixed(2) ?? 'N/A' }} €/MWh</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { apiService } from '@/services/apiService';
import type { PvRealTimeData, PvProductionSummaryData, PowerData } from '@/types/apiService';


const realTimeBukk = ref<PvRealTimeData | null>(null);
const realTimeHalmaj = ref<PvRealTimeData | null>(null);
const productionBukk = ref<PvProductionSummaryData | null>(null);
const productionHalmaj = ref<PvProductionSummaryData | null>(null);
const monthlyProductionBukk = ref<number | null>(null);
const monthlyProductionHalmaj = ref<number | null>(null);

const hupxAvg = ref<number | null>(null);
const balancingUp = ref<number | null>(null);
const balancingDown = ref<number | null>(null);
const balancingUpTimestamp = ref<string | null>(null);
const balancingDownTimestamp = ref<string | null>(null);
const loading = ref(true);

// Összegzett értékek számítása


const totalRealTime = computed(() => {
  const bukkPower = Math.abs(realTimeBukk.value?.current_power_kw || 0);
  const halmajPower = realTimeHalmaj.value?.current_power_kw || 0;
  return bukkPower + halmajPower;
});


const formatTime = (timestamp: string | null) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};
const totalProduction = computed(() => {
  return (productionBukk.value?.production_kwh || 0) + (productionHalmaj.value?.production_kwh || 0);
});

const totalMonthlyProduction = computed(() => {
  return (monthlyProductionBukk.value || 0) + (monthlyProductionHalmaj.value || 0);
});

const fetchData = async () => {
  try {
    const { data: realTimeData } = await apiService.getPvRealTimeData();
    realTimeBukk.value = realTimeData.find(item => item.plant.toLowerCase().includes("bukk")) || null;
    realTimeHalmaj.value = realTimeData.find(item => item.plant.toLowerCase().includes("halmaj")) || null;

    const { data: productionData } = await apiService.getPvProductionSummary();
    productionBukk.value = productionData.find(item => item.plant.toLowerCase().includes("bukk")) || null;
    productionHalmaj.value = productionData.find(item => item.plant.toLowerCase().includes("halmaj")) || null;

    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

    const { data: bukkMonthlyData } = await apiService.getBukkDailyData(year, month);
    monthlyProductionBukk.value = bukkMonthlyData.reduce((sum, entry) => sum + entry.power_kw, 0);

    const { data: halmajMonthlyData } = await apiService.getHalmajDailyData(year, month);
    monthlyProductionHalmaj.value = halmajMonthlyData.reduce((sum, entry) => sum + entry.power_kw, 0);

    const currentDate2 = new Date().toISOString().split('T')[0];

    const { avg: hupxAvgPrice } = await apiService.getHUPXData(currentDate2);
    hupxAvg.value = hupxAvgPrice ?? null;

    const { lastData: lastBalancing } = await apiService.getBalancingActivatedPrice(currentDate2);
    balancingUp.value = lastBalancing?.up_price ?? null;
    balancingDown.value = lastBalancing?.down_price ?? null;
    balancingUpTimestamp.value = lastBalancing?.timestamp ?? null;
    balancingDownTimestamp.value = lastBalancing?.timestamp ?? null;
  } catch (error) {
    console.error("🚨 Hiba történt az adatok lekérésekor:", error);
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 300);
  }
};
let interval: string | number | NodeJS.Timeout | undefined;
onMounted(() => {
  fetchData();
  interval = setInterval(fetchData, 10000);
});
onUnmounted(() => clearInterval(interval));
</script>

<style>
@media (max-width: 768px) {
  .cards{
    display: block;
  }
}
</style>
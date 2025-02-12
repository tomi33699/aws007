<template>
  <div class="dashboard-container">
    <CurrentState/>
    <Chart />
    <ForecastChart />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Chart from '@/components/chart.vue';
import ForecastChart from '@/components/ForecastChart.vue';
import CurrentState from '@/components/CurrentState.vue';

const refreshInterval = 60000; // 60 másodperc

const fetchAllData = () => {
  console.log("🔄 Adatok frissítése...");
  // Frissíti az összes komponenst
  const event = new Event("refresh-data");
  window.dispatchEvent(event);
};

onMounted(() => {
  fetchAllData(); // Betöltéskor is frissítés
  setInterval(fetchAllData, refreshInterval); // 1 percenként frissít
});
</script>

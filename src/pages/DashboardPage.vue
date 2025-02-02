<template>
  <div class="dashboard-container" :class="{ 'collapsed-sidebar': isSidebarCollapsed }">
    <h1 class="dashboard-title"></h1>
    <Globe />
    <div class="banner-section">
      <Banner />
      <CarouselBanner />
    </div>
    <div class="portfolio-container">
      <h2>Portfolio aktuális termelés adatok</h2>
      <CardView :data="actualData" />
      <div class="chart-section">
        <h2 class="chart-title"></h2>
        <PVChart />
        <ChartView />
      </div>
    </div>
    <div>
      <DailyPowerChart />
    </div>
    <div>
      <BukkRealTime />
    </div>
    <div>
      <BalancingChart />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import CardView from "../components/CardView.vue";
import ChartView from "../components/ChartView.vue"; // Import the ChartView component
import apiService from "@/services/apiService";
import PVChart from "@/components/PVChart.vue";
import Banner from "@/components/Banner.vue";
import CarouselBanner from "@/components/CarouselBanner.vue";
import Globe from "@/components/Globe.vue";
import BukkMaterializedChart from "@/components/BukkMaterializedChart.vue";
import BukkRealTime from "@/components/BukkRealTime.vue";
import DailyPowerChart from "@/components/DailyPowerChart.vue";
import BalancingChart from "@/components/BalancingChart.vue";
const actualData = ref({
  bukk_prod_actual: 0,
  bukk_irrad_actual: 0,
  halmaj_prod_actual: 0,
  halmaj_irrad_actual: 0,
  pv_prod_actual: 0,
  pv_irrad_actual: 0,
  hupx_price_actual: 0,
});
const isSidebarCollapsed = ref(false);
function handleSidebarToggle(collapsed: boolean) {
  isSidebarCollapsed.value = collapsed;
}
onMounted(async () => {
  try {
    const response = await apiService.getPvActualData();
    actualData.value = response[0];
  } catch (error) {
    console.error("Error fetching actual data:", error);
  }
});
</script>
<style scoped>
.dashboard-container {
  box-sizing: border-box;
  padding: 0em 1em;
  display: block;
  overflow-y: auto;
  /* Görgethetőség engedélyezése */
  transition: margin-left 0.5s ease;
  /* Margin animálása */
}

.dashboard-container.collapsed-sidebar {
  margin-left: 7vw;
  /* Összecsukott sidebar esetén */
}

.dashboard-title {
  margin-bottom: auto;
  color: #333;
}

.chart-section {
  margin-top: auto;
}

.chart-title {
  margin-bottom: auto;
  color: #333;
}

.banner-section {
  margin: 1em 0;
  gap: 1em;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.portfolio-container {
  background: white;
  border-radius: 10px;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.1);
}

.portfolio-container h2 {
  padding: 1em;
  text-align: left;
}


@media screen and (max-width: 768px) {
 .dashboard-container{
  padding: 0;
 } 
 .banner-section{
  grid-template-columns: 1fr;
 }
 .chart-section{
  padding: 0;
 }
 .chart-title{
  display: none;
 }
}
</style>

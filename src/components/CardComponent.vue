<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import {
  getBukkData,
  getHalmajData,
  getHupxData,
  getBalancingData,
  getBalancingVolume,
  getActualLoadData,
  getForecastLoad,
} from "../apiService";

// Adatok tárolása
const production = reactive({
  value: "Betöltés...",
  lastUpdate: "N/A",
});
const irradiation = reactive({
  value: "Betöltés...",
  lastUpdate: "N/A",
});
const hupxAverage = reactive({
  value: "Betöltés...",
  lastUpdate: "N/A",
});
const balancingPrices = reactive({
  upPrice: "Betöltés...",
  downPrice: "Betöltés...",
  lastUpdate: "N/A",
});
const balancingVolumes = reactive({
  upVolume: "Betöltés...",
  downVolume: "Betöltés...",
  lastUpdate: "N/A",
});
const load = reactive({
  actual: "Betöltés...",
  forecast: "Betöltés...",
  lastUpdate: "N/A",
});

// Segédfüggvények
function formatNumber(value: number): string {
  return value.toFixed(2);
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("hu-HU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

// Adatok lekérése az API-kból
async function fetchData() {
  try {
    const today = new Date().toISOString().split("T")[0]; // Aktuális dátum YYYY-MM-DD formátumban

    const bukkData = await getBukkData(today); // Megadjuk a dátumot
    const halmajData = await getHalmajData();
    const hupxData = await getHupxData();
    const balancingData = await getBalancingData();
    const balancingVolumeData = await getBalancingVolume();
    const actualLoadData = await getActualLoadData();
    const forecastLoadData = await getForecastLoad();

    if (
      Array.isArray(bukkData) &&
      bukkData.length > 0 &&
      Array.isArray(halmajData) &&
      halmajData.length > 0 &&
      Array.isArray(hupxData) &&
      hupxData.length > 0 &&
      Array.isArray(balancingData) &&
      balancingData.length > 0 &&
      Array.isArray(balancingVolumeData) &&
      balancingVolumeData.length > 0 &&
      Array.isArray(actualLoadData) &&
      actualLoadData.length > 0 &&
      Array.isArray(forecastLoadData) &&
      forecastLoadData.length > 0
    ) {
      const bukkLast = bukkData[bukkData.length - 1];
      const halmajLast = halmajData[halmajData.length - 1];

      const totalProduction =
        (bukkLast.powerp ?? 0) + (halmajLast.power_output ?? 0);
      production.value = `${totalProduction.toFixed(2)} kW`;
      production.lastUpdate = formatTime(bukkLast.time);

      const totalIrradiation =
        (bukkLast.irrad ?? 0) + (halmajLast.total_radiation ?? 0);
      irradiation.value = `${totalIrradiation.toFixed(2)} W/m²`;
      irradiation.lastUpdate = formatTime(bukkLast.time);

      // HUPX napi árak átlaga az utolsó napra
      const lastDate = hupxData[hupxData.length - 1]?.date;
      const dailyData = hupxData.filter((item) => item.date === lastDate);
      const averagePrice =
        dailyData.reduce((sum, item) => sum + item.price, 0) / dailyData.length;
      hupxAverage.value = `${averagePrice.toFixed(2)} €/MWh`;
      hupxAverage.lastUpdate = formatDate(lastDate);

      // Balancing Prices adatainak frissítése
      const balancingLast = balancingData[balancingData.length - 1];
      balancingPrices.upPrice = `${formatNumber(
        balancingLast.up_price / 1000
      )} Ft/kWh`;
      balancingPrices.downPrice = `${formatNumber(
        balancingLast.down_price / 1000
      )} Ft/kWh`;
      balancingPrices.lastUpdate = formatTime(balancingLast.date);

      // Balancing Volumes adatainak frissítése
      const balancingVolumeLast =
        balancingVolumeData[balancingVolumeData.length - 1];
      balancingVolumes.upVolume = `${formatNumber(
        balancingVolumeLast.up_regulation
      )} MW`;
      balancingVolumes.downVolume = `${formatNumber(
        balancingVolumeLast.down_regulation
      )} MW`;
      balancingVolumes.lastUpdate = formatTime(balancingVolumeLast.date);

      // Load adatainak frissítése
      const actualLoadLast = actualLoadData[actualLoadData.length - 1];
      const forecastLoadMatch = forecastLoadData.find(
        (item) => item.date === actualLoadLast.date
      );
      load.actual = `${formatNumber(actualLoadLast.load / 1000)} GW`;
      load.forecast = forecastLoadMatch
        ? `${formatNumber(forecastLoadMatch.load / 1000)} GW`
        : "N/A";
      load.lastUpdate = formatTime(actualLoadLast.date);
    } else {
      production.value = "Hiba az adatokban";
      irradiation.value = "Hiba az adatokban";
      hupxAverage.value = "Hiba az adatokban";
      balancingPrices.upPrice = "Hiba";
      balancingPrices.downPrice = "Hiba";
      balancingPrices.lastUpdate = "N/A";
      balancingVolumes.upVolume = "Hiba";
      balancingVolumes.downVolume = "Hiba";
      balancingVolumes.lastUpdate = "N/A";
      load.actual = "Hiba";
      load.forecast = "Hiba";
      load.lastUpdate = "N/A";
    }
  } catch (error) {
    console.error("Hiba történt az adatok lekérésekor:", error);
  }
}

// Komponens betöltésekor adatok lekérése
onMounted(fetchData);
</script>

<template>
  <div class="cards">
    <div class="card">
      <div class="card-content">
        <div class="card-text">
          <span class="card-title">Aktuális termelés <span class="card-title-span">(Frissítve: {{ production.lastUpdate }})</span></span>
          <span class="card-value">{{ production.value }}</span>
        </div>
        <span class="material-icons card-icon">bolt</span>
      </div>
    </div>
    <div class="card">
      <div class="card-content">
        <div class="card-text">
          <span class="card-title">Aktuális besugárzás <span class="card-title-span">(Frissítve: {{ irradiation.lastUpdate }})</span></span>
          <span class="card-value">{{ irradiation.value }}</span>
        </div>
        <span class="material-icons card-icon">flash_on</span>
      </div>
    </div>
    <div class="card">
      <div class="card-content">
        <div class="card-text">
          <span class="card-title">HUPX átlagár  <span class="card-title-span">(Dátum: {{ hupxAverage.lastUpdate }})</span></span>
          <span class="card-value">{{ hupxAverage.value }}</span>
        </div>
        <span class="material-icons card-icon">trending_up</span>
      </div>
    </div>
    <div class="card">
      <div class="card-content">
        <div class="card-text">
          <span class="card-title">Szabályozás árak  <span class="card-title-span">(Frissítve: {{ balancingPrices.lastUpdate }})</span></span>
          <span class="card-value">⬆ {{ balancingPrices.upPrice }} | ⬇ {{ balancingPrices.downPrice }}</span>
        </div>
        <span class="material-icons card-icon">compare_arrows</span>
      </div>
    </div>
    <div class="card">
      <div class="card-content">
        <div class="card-text">
          <span class="card-title">Szabályozás mennyiség  <span class="card-title-span">(Frissítve: {{ balancingVolumes.lastUpdate }})</span></span>
          <span class="card-value">⬆ {{ balancingVolumes.upVolume }} | ⬇ {{ balancingVolumes.downVolume }}</span>
        </div>
        <span class="material-icons card-icon">equalizer</span>
      </div>
    </div>
    <div class="card">
      <div class="card-content">
        <div class="card-text">
          <span class="card-title">Rendszerterhelés  <span class="card-title-span">(Frissítve: {{ load.lastUpdate }})</span></span>
          <span class="card-value">A: {{ load.actual }} | F: {{ load.forecast }}</span>
        </div>
        <span class="material-icons card-icon">show_chart</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.card {
  padding: 20px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.card-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.card-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.card-title-span{
  font-size: .8em;
}

.card-value {
  font-weight: bold;
}

.card-icon {
  font-size: 2em;
  color: #41B883;
}

.material-icons{
  background-color: #2C3E50;
  border-radius: 5px;
  padding: .2em;
}
</style>

<template>
  <div class="solar-dashboard">
    <!-- Bal oszlop: Naperőművek -->
    <div class="solar-plants">
      <!-- Bükki naperőmű -->
      <div class="solar-icon">
        <div class="icon-container">
          <span class="material-icons solar-plant-icon">solar_power</span>
        </div>
        <div class="text-container">
          <p>Bükkábrány</p>
          <p>{{ bukk.production.toFixed(2) }} kW</p>
          <p :class="{ active: bukk.isActive, inactive: !bukk.isActive }">
            {{ bukk.isActive ? "Aktív" : "Inaktív" }}
          </p>
        </div>
      </div>

      <!-- Halmaji naperőmű -->
      <div class="solar-icon">
        <div class="icon-container">
          <span class="material-icons solar-plant-icon">solar_power</span>
        </div>
        <div class="text-container">
          <p>Halmajugra</p>
          <p>{{ halmaj.production.toFixed(2) }} kW</p>
          <p :class="{ active: halmaj.isActive, inactive: !halmaj.isActive }">
            {{ halmaj.isActive ? "Aktív" : "Inaktív" }}
          </p>
        </div>
      </div>
    </div>

    <!-- Középső oszlop: Nyilak -->
    <div class="arrows-column">
      <!-- Bükki nyíl -->
<div
  class="arrow arrow1"
  :class="{ 'arrow-active': bukk.isActive, 'arrow-inactive': !bukk.isActive }"
  :style="bukk.isActive ? { animation: 'dash-move 1.5s linear infinite' } : { animation: 'none' }"
></div>

<!-- Halmaji nyíl -->
<div
  class="arrow arrow2"
  :class="{ 'arrow-active': halmaj.isActive, 'arrow-inactive': !halmaj.isActive }"
  :style="halmaj.isActive ? { animation: 'dash-move 1.5s linear infinite' } : { animation: 'none' }"
></div>

    </div>

    <!-- Középső ikon: Összesített termelés -->
    <div class="central-dashboard">
      <div class="dashboard-icon">
        <span class="material-icons">bolt</span>
        <p>Termelés</p>
        <p>{{ totalProduction.toFixed(2) }} kW</p>
      </div>
    </div>

    <!-- Kép a dashboard mellé -->
    <div class="solar-image-container"></div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from "vue";
import { getBukkData, getHalmajData } from "../apiService";

// Adatok tárolása
const bukk = reactive({
  production: 0,
  isActive: false,
});

const halmaj = reactive({
  production: 0,
  isActive: false,
});

const totalProduction = computed(() => bukk.production + halmaj.production);

const isBothActive = computed(() => bukk.isActive && halmaj.isActive);

// Időformázás
function isDataRecent(lastUpdated: string): boolean {
  const currentTime = new Date().getTime();
  const updatedTime = new Date(lastUpdated).getTime();
  return (currentTime - updatedTime) / 1000 / 60 < 5; // kevesebb mint 5 perc
}

// Adatok lekérése az API-ból
async function fetchData() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const bukkData = await getBukkData(today);
    const halmajData = await getHalmajData();

    if (bukkData && bukkData.length > 0) {
      const latestBukk = bukkData[bukkData.length - 1];
      bukk.production = latestBukk.powerp ?? 0;
      bukk.isActive = isDataRecent(latestBukk.time);
    }

    if (halmajData && halmajData.length > 0) {
      const latestHalmaj = halmajData[halmajData.length - 1];
      halmaj.production = latestHalmaj.power_output ?? 0;
      halmaj.isActive = isDataRecent(latestHalmaj.timestamp);
    }
  } catch (error) {
    console.error("Hiba az adatok lekérésekor:", error);
  }
}

// Komponens betöltésekor adatok lekérése
onMounted(() => {
  fetchData();
  setInterval(fetchData, 300000); // 5 percenként frissítés
});
</script>

<style scoped>
.solar-dashboard {
  display: grid;
  grid-template-columns: 1.1fr 0.6fr 1fr 1.3fr;
  align-items: center;
  justify-content: center;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0.5em;
  margin-bottom: 1em;
  border-radius: 5px;
}

.solar-plants {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2em;
}

.solar-icon {
  display: grid;
  grid-template-columns: .7fr 1.3fr;
  text-align: center;
  align-items: center;
  background: #2c3e50;
  color: #f7f9fa;
  border-radius: 5px;
  width: 90%;
  margin-right: auto;
  padding: .5em;
}

.icon-container {
  margin-right: 1em;
}



.text-container {
  display: flex;
  flex-direction: column;
}

.arrows-column {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
}

.arrow {
  width: 80%;
  margin: 20px 0;
  height: 2px;
  background: repeating-linear-gradient(
    to right,
    white 0,
    white 1em,
    transparent 1em,
    transparent 2em
  ); /* Szaggatott vonal */
  position: relative;
  animation: dash-move 20s linear infinite; /* Egyenletes animáció */

}

.arrow:after {
  content: "";
  position: absolute;
  top: -4.8px; /* Nyílhegy pozíció */
  right: -11px; /* Nyílhegy igazítása */
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 10px solid white; /* Nyílhegy színe */
}

.arrow1 {
  top: 1em;
}

.arrow2 {
  top: -1em;
}



.arrow-active {
  background-color: #41b883;
}

.arrow-active:after {
  border-left-color: #41b883;
}

.arrow-inactive {
  background-color: grey;
}

.arrow-inactive:after {
  border-left-color: grey;
}

.central-dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin-right: auto;
}

.dashboard-icon {
  background: #2c3e50;
  color: #f7f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
  border-radius: 5px;
  padding: 2.5em 1em;
}

.solar-image-container {
  width: 100%;
  height: 100%;
  background: url(../assets/napelem.jpg);
  background-position: center;
  background-size: cover;
  border-radius: 5px;
}

.active {
  color: #41b883;
}

.inactive {
  color: grey;
}

.material-icons{
  font-size: 2.5em;
  color: #41b883;
}

/* Egyenletes animáció a szaggatott vonalhoz */
@keyframes dash-move {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100em 0; /* Ismétlődési távolság szinkronban a mintával */
  }


}
</style>

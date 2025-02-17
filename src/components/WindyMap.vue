<template>
  <div class="windy-container">
    <div id="windy-container">
      <div id="windy"></div>
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue";

export default {
  setup() {
    const WINDY_API_KEY = "mjJC4nO9vbsm0fyzsNOoNyC3RjIT1V75";

    onMounted(async () => {
      try {
        await loadWindyAPI();
        initializeWindyMap();
      } catch (error) {
        console.error("🚨 Windy API betöltési hiba:", error);
      }
    });

    function loadWindyAPI() {
      return new Promise((resolve, reject) => {
        if (window.windyInit) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = "https://api.windy.com/assets/map-forecast/libBoot.js";
        script.async = true;
        script.onload = resolve;
        script.onerror = () => reject("Nem sikerült betölteni a Windy API scriptet.");
        document.body.appendChild(script);
      });
    }

    function initializeWindyMap() {
      window.windyInit({
        key: WINDY_API_KEY,
        lat: 47.7833,
        lon: 20.0133,
        zoom: 7,
        container: "windy",
        overlay: "clouds",
        willReadFrequently: true,
        onReady: windyAPI => {
          const { map } = windyAPI;
          map.invalidateSize();
          map.setView([47.7833, 20.0133], 7);
        }
      });
    }

    return {};
  }
};
</script>

<style>
.windy-container {
  width: 100%;
  height: 600px;
  position: relative;
}
#windy-container{
  width: 100%;
  height: 600px;
  position: relative;
}
.windy-container::before{
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  z-index: 500;
}
#windy {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div id="windy-container">
    <div id="windy"></div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const WINDY_API_KEY = "mjJC4nO9vbsm0fyzsNOoNyC3RjIT1V75";
    const loading = ref(true);

    onMounted(async () => {
      try {
        await loadWindyAPI();
        await waitForWindyInit();
        initializeWindyMap();
      } catch (error) {
        console.error("🚨 Windy API betöltési hiba:", error);
      } finally {
        loading.value = false;
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

    function waitForWindyInit(attempts = 15) {
      return new Promise((resolve, reject) => {
        const check = () => {
          if (window.windyInit) resolve();
          else if (attempts > 0) setTimeout(() => check(--attempts), 500);
          else reject("Windy API nem töltődött be megfelelően.");
        };
        check();
      });
    }

    function initializeWindyMap() {
      window.windyInit({
        key: WINDY_API_KEY,
        lat: 47.7833,
        lon: 20.0133,
        zoom: 7,
        container: "clouds",
        overlay: "clouds",
        onReady: windyAPI => {
          const { map } = windyAPI;
                
          map.invalidateSize();
        }
      });
    }

    return { loading };
  }
};
</script>

<style>
#windy-container {
  width: 100%;
  height: 600px;
  position: relative;
}
#windy-container::before{
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
<template>
  <div class="globe-container">
    <canvas ref="globeCanvas"></canvas>
    <div class="overlay">
      <div class="data-column left">
        <div class="chart-container"> 
          <h2 class="chart-container-h2"> Időjárás előrejelzés <br> <span class="chart-cont-span">Bükkábrány</span></h2>
          <apexchart
            type="line"
            height="80%"
            :options="halmajChartOptions"
            :series="halmajSeries"
          ></apexchart>
        </div>
      </div>

      <div class="update-container">
        <span class="update-time">Utolsó frissítés: {{ lastUpdate }}</span>
        <button class="refresh-btn" @click="refreshData">
          <i class="fas fa-sync-alt"></i> Frissítés
        </button>
      </div>

      <div class="data-column right">
        <div class="chart-container">
          <h2 class="chart-container-h2"> Időjárás előrejelzés <br><span class="chart-cont-span">Halmajugra</span> </h2>
          <apexchart
            type="line"
            height="80%"
            :options="bukkChartOptions"
            :series="bukkSeries"
          ></apexchart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import axios from "axios";
import VueApexCharts from "vue3-apexcharts";

export default {
  name: "WeatherGlobe",
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      halmajSeries: [],
      bukkSeries: [],
      lastUpdate: "N/A",
      apiKey: import.meta.env.VITE_OPENWEATHER_API_KEY,
      locations: {
        halmaj: { lat: 47.8167, lon: 20.0833 },
        bukk: { lat: 47.9333, lon: 20.6667 },
      },
      halmajChartOptions: this.getChartOptions([]),
      bukkChartOptions: this.getChartOptions([]),
    };
  },
  mounted() {
    this.initGlobe();
    this.fetchWeatherData();
    setInterval(this.fetchWeatherData, 600000);
  },
  methods: {
    async fetchWeatherData() {
      try {
        console.log("🔄 Időjárás adatok frissítése...");

        const [halmajResponse, bukkResponse] = await Promise.all([
          axios.get(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${this.locations.halmaj.lat}&lon=${this.locations.halmaj.lon}&units=metric&exclude=current,minutely,daily,alerts&appid=${this.apiKey}`
          ),
          axios.get(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${this.locations.bukk.lat}&lon=${this.locations.bukk.lon}&units=metric&exclude=current,minutely,daily,alerts&appid=${this.apiKey}`
          ),
        ]);

        this.updateChartData(halmajResponse.data, "halmaj");
        this.updateChartData(bukkResponse.data, "bukk");

        this.lastUpdate = new Date().toLocaleString("hu-HU");
      } catch (error) {
        console.error("❌ Hiba az időjárás adatok lekérésekor:", error);
      }
    },
    updateChartData(data, location) {
      if (!data || !data.hourly) return;

      const tempData = [];
      const irradiationData = [];
      const cloudinessData = [];
      const labels = [];

      for (let i = 0; i < 24; i++) {
        const entry = data.hourly[i];
        if (!entry) continue;
        const timestamp = new Date(entry.dt * 1000);
        const formattedTime = timestamp.toLocaleString("hu-HU", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit"
        });

        labels.push(formattedTime);
        tempData.push(entry.temp ?? 0);
        cloudinessData.push(entry.clouds ?? 0);
        irradiationData.push(this.calculateIrradiance(entry));
      }

      const chartOptions = this.getChartOptions(labels);

      if (location === "halmaj") {
        this.halmajSeries = [
          { name: "Hőmérséklet (°C)", data: tempData },
          { name: "Besugárzás (W/m²)", data: irradiationData },
          { name: "Felhőzet (%)", data: cloudinessData },
        ];
        this.halmajChartOptions = chartOptions;
      } else {
        this.bukkSeries = [
          { name: "Hőmérséklet (°C)", data: tempData },
          { name: "Besugárzás (W/m²)", data: irradiationData },
          { name: "Felhőzet (%)", data: cloudinessData },
        ];
        this.bukkChartOptions = chartOptions;
      }
    },
    calculateIrradiance(data) {
      return Math.round(1000 * (1 - (data.clouds ?? 0) / 100));
    },
    getChartOptions(labels) {
      return {
        chart: { toolbar: { show: false }, },
        stroke: { curve: "smooth", width: 3 },
        markers: { size: 1 },
        colors: ["#FFA500", "#00BFFF", "#808080"],
        tooltip: { theme: "dark" },
        xaxis: { categories: labels },
        yaxis: [
          { title: { text: "Hőmérséklet (°C)" } },
          { opposite: true, title: { text: "Besugárzás (W/m²)" } },
          { opposite: true, title: { text: "Felhőzet (%)" } },
        ],
      };
    },
    initGlobe() {
      const canvas = this.$refs.globeCanvas;
      if (!canvas) return;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      camera.position.z = 2;

      const texture = new THREE.TextureLoader().load("https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg");
      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshStandardMaterial({ map: texture })
      );
      scene.add(globe);
      const light = new THREE.DirectionalLight(0xffffff, 0.5);
      light.position.set(5, 5, 5).normalize();
      scene.add(light);

      function animate() {
        requestAnimationFrame(animate);
        globe.rotation.y += 0.001;
        renderer.render(scene, camera);
      }
      animate();
    }
  }
};
</script>
<style scoped>
.globe-container {
  width: 100%;
  height: 400px;
  margin: 1em 0;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
  position: relative; /* A canvasnak megmarad az alap pozíciója */
  z-index: 1; /* A háttérben marad */

}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10; /* Az overlay a canvas elé kerül *
  /
  pointer-events: auto; /* Az overlay kattintható marad */
}

.chart-container {
  border-radius: 10px;
  overflow: hidden;
  background: rgb(255, 255, 255);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  height: 90%;
  align-content: center;
}

.chart-container-h2{
  color: black;
  text-align: center;
}

.chart-cont-span{
  font-size: smaller
}

.data-column {
  width: 32%;
  color: white;
  font-size: .8em;
  height: 100%;
  align-content: center;
  margin: 0 1em;
}

.globe-item {
  text-align: center;
  font-weight: bold;
}

.globe-item i {
  font-size: 2em;
  color: #fac107e5;
}

.update-container {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-weight: bold;
  font-size: 1em;
  padding: 5px 10px;
  border-radius: 5px;
  display: flex;
  gap: 10px;
  align-items: center;
  z-index: 15; /* Az overlay fölött is lesz */
  pointer-events: auto; /* Biztosítja, hogy kattintható marad */
}

.refresh-btn {
  background-color: #fac107;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-weight: bold;
  border-radius: 5px;
  z-index: 20; /* A gomb az overlay és a canvas felett lesz */
}

.refresh-btn:hover {
  background-color: #e0a900;
}


</style>

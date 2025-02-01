<template>
  <div class="globe-container" :class="{ 'sidebar-open': isSidebarOpen }">
    <canvas ref="globeCanvas"></canvas>
    <div class="overlay">
      <div class="data-column left">
        <div class="chart-container">
          <h2 class="chart-container-h2"> Időjárás előrejelzés (24 órás)<br> <span class="chart-cont-span">Bükkábrány</span></h2>
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
          <h2 class="chart-container-h2"> Időjárás előrejelzés (24 órás) <br><span class="chart-cont-span">Halmajugra</span> </h2>
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
    isSidebarOpen: false, // 🔹 Sidebar állapot
    apiKey: import.meta.env.VITE_OPENWEATHER_API_KEY,
    locations: {
      halmaj: { lat: 47.8167, lon: 20.0833 },
      bukk: { lat: 47.9333, lon: 20.6667 },
    },
    halmajChartOptions: this.getChartOptions([]),
    bukkChartOptions: this.getChartOptions([]),
  };
  },
  watch: {
    isSidebarOpen() {
      this.$nextTick(() => {
        this.resizeCanvas();
      });
    }
  },
  mounted() {
  this.initGlobe();
  this.fetchWeatherData();
  setInterval(this.fetchWeatherData, 600000);
  window.addEventListener("resize", this.resizeCanvas);
  window.addEventListener("sidebar-toggle", this.handleSidebarToggle);
},
beforeUnmount() {
  window.removeEventListener("resize", this.resizeCanvas);
  window.removeEventListener("sidebar-toggle", this.handleSidebarToggle);
},
  methods: {
    handleSidebarToggle(event) {
    this.isSidebarOpen = event.detail;
  },
    async fetchWeatherData() {
      try {
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
    async refreshData() {
    await this.fetchWeatherData();
    this.lastUpdate = new Date().toLocaleString("hu-HU"); // Kézzel frissítjük az időbélyeget
  },
  resizeCanvas() {
    this.$nextTick(() => {
      const canvas = this.$refs.globeCanvas;
      if (!canvas) return;

      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;

      if (this.renderer) {
        this.renderer.setSize(canvas.width, canvas.height);
      }});
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
      if (!canvas) {
        console.error("🚨 Hiba: A Globe Canvas nem található!");
        return;
      }
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000
      );
      this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      this.resizeCanvas();
      camera.position.z = 2;
      const texture = new THREE.TextureLoader().load(
        "https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg"
      );
      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshStandardMaterial({ map: texture })
      );
      scene.add(globe);
      const light = new THREE.DirectionalLight(0xffffff, 0.5);
      light.position.set(5, 5, 5).normalize();
      scene.add(light);
      const animate = () => {
        requestAnimationFrame(animate);
        globe.rotation.y += 0.001;
        this.renderer.render(scene, camera);
      };
      animate();

  // Ablak átméretezésekor frissítjük a canvas méretét
  window.addEventListener("resize", this.resizeCanvas);
}

  }
};
</script>
<style scoped>
.globe-container {
  height: 400px;
  margin: 1em 0;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  background-color: black; /* Biztosítja, hogy a háttér nem tűnik el */
  transition: width 0.3s ease-in-out; /* 🔹 Simább animáció */
  width: calc(100% - var(--sidebar-width, 0px)); /* 🔹 Dinamikus szélesség */
}
canvas {
  width: 100%;
  height: 100%;
  display: block;
  position: absolute; /* Fixálja a helyzetét */
  top: 0;
  left: 0;
  z-index: 1;
  background-color: black; /* Fekete háttér biztosítása */

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
.logo-container {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2em;
  text-align: center;
  z-index: 20;
}
.logo-container h1 {
  font-family: 'Rubik Glitch', sans-serif;
  font-size: 3.5rem;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  letter-spacing: 2px;
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
.globe-container.sidebar-open {
  width: calc(100% - 1em); /* Példa: a sidebar szélessége */
}
</style>

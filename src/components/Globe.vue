<template>
  <div class="globe-container">
    <canvas ref="globeCanvas"></canvas>
    <div class="overlay">
      <div class="data-column left">
        <div class="globe-item">
          <i class="fas fa-thermometer-half"></i>
          Bükk Hőmérséklet: <span>{{ bukkData.temperature }}°C</span>
        </div>
        <div class="globe-item">
          <i class="fas fa-sun"></i>
          Bükk Besugárzás: <span>{{ bukkData.irradiance }} W/m²</span>
        </div>
        <div class="globe-item">
          <i class="fas fa-cloud"></i>
          Bükk Felhő Valószínűség: <span>{{ bukkData.cloudiness }}%</span>
        </div>
      </div>
      <div class="data-column right">
        <div class="globe-item">
          <i class="fas fa-thermometer-half"></i>
          Halmaj Hőmérséklet: <span>{{ halmajData.temperature }}°C</span>
        </div>
        <div class="globe-item">
          <i class="fas fa-sun"></i>
          Halmaj Besugárzás: <span>{{ halmajData.irradiance }} W/m²</span>
        </div>
        <div class="globe-item">
          <i class="fas fa-cloud"></i>
          Halmaj Felhő Valószínűség: <span>{{ halmajData.cloudiness }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import axios from "axios";

export default {
  name: "RotatingGlobe",
  data() {
    return {
      bukkData: {
        temperature: null,
        irradiance: null,
        cloudiness: null,
      },
      halmajData: {
        temperature: null,
        irradiance: null,
        cloudiness: null,
      },
      apiKey: import.meta.env.VITE_OPENWEATHER_API_KEY,
      locations: {
        bukk: { lat: 47.9333, lon: 20.6667 },
        halmaj: { lat: 47.8167, lon: 20.0833 },
      },
    };
  },
  mounted() {
    this.initGlobe();
    this.fetchWeatherData();
    setInterval(this.fetchWeatherData, 600000);
  },
  methods: {
    initGlobe() {
      const canvas = this.$refs.globeCanvas;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

      function resizeCanvas() {
        const parent = canvas.parentElement;
        const newWidth = parent.offsetWidth;
        const newHeight = parent.offsetHeight;
        renderer.setSize(newWidth, newHeight);
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
      }

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      const observer = new ResizeObserver(resizeCanvas);
      observer.observe(canvas.parentElement);

      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const texture = new THREE.TextureLoader().load("https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg");
      const material = new THREE.MeshStandardMaterial({ map: texture, metalness: 0.1, roughness: 0.7 });
      const globe = new THREE.Mesh(geometry, material);
      scene.add(globe);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      const backgroundLight = new THREE.PointLight(0x404040, 0.1);
      backgroundLight.position.set(0, 0, -5);
      scene.add(backgroundLight);

      camera.position.z = 2;

      function animate() {
        requestAnimationFrame(animate);
        globe.rotation.y += 0.001;
        renderer.render(scene, camera);
      }
      animate();
    },
    async fetchWeatherData() {
      try {
        const bukkResponse = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${this.locations.bukk.lat}&lon=${this.locations.bukk.lon}&units=metric&appid=${this.apiKey}`);
        const halmajResponse = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${this.locations.halmaj.lat}&lon=${this.locations.halmaj.lon}&units=metric&appid=${this.apiKey}`);

        this.bukkData.temperature = bukkResponse.data.current.temp;
        this.bukkData.cloudiness = bukkResponse.data.current.clouds;
        this.bukkData.irradiance = this.calculateIrradiance(bukkResponse.data.current);
        
        this.halmajData.temperature = halmajResponse.data.current.temp;
        this.halmajData.cloudiness = halmajResponse.data.current.clouds;
        this.halmajData.irradiance = this.calculateIrradiance(halmajResponse.data.current);
      } catch (error) {
        console.error("Hiba az időjárás adatok lekérésekor:", error);
      }
    },
    calculateIrradiance(data) {
      const cloudFactor = 1 - data.clouds / 100;
      const baseIrradiance = 1000;
      return Math.round(baseIrradiance * cloudFactor);
    }
  }
};
</script>

<style scoped>
.globe-container {
    width: 100%; /* Set to half the width */
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
}
.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    pointer-events: none;
}
.data-column {
    width: 20%;
    margin: 4em 1em;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    color: white; 
    width: 100%;
    font-size: .8em;
}
.data-column.left {
    display: grid;
    align-items: center;
}
.data-column.right {
    display: grid;
    align-items: center;
}
.globe-item {
    display: grid;
    text-align: center;
    grid-template-columns: 1fr;
    align-items: center;
    font-weight: bold;
    gap: .5em;
}
.globe-item i {
    width: fit-content;
    font-size: 2em;
    color: #fac107e5;
    margin: 0 auto;
}
</style>

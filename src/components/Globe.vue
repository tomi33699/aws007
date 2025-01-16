<template>
    <div class="globe-container">
      <canvas ref="globeCanvas"></canvas>
      <div class="overlay">
        <div class="data-column left">
          <div class="globe-item">
            <i class="fas fa-thermometer-half"></i>
            Bükk Hőmérséklet: <span>15°C</span>
          </div>
          <div class="globe-item">
            <i class="fas fa-sun"></i>
            Bükk Besugárzás: <span>200 W/m²</span>
          </div>
          <div class="globe-item">
            <i class="fas fa-cloud"></i>
            Bükk Felhő Valószínűség: <span>40%</span>
          </div>
        </div>
        <div class="data-column right">
          <div class="globe-item">
            <i class="fas fa-thermometer-half"></i>
            Halmaj Hőmérséklet: <span>18°C</span>
          </div>
          <div class="globe-item">
            <i class="fas fa-sun"></i>
            Halmaj Besugárzás: <span>250 W/m²</span>
          </div>
          <div class="globe-item">
            <i class="fas fa-cloud"></i>
            Felhő Valószínűség: <span>30%</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import * as THREE from "three";

export default {
    name: "RotatingGlobe",
    mounted() {
        const canvas = this.$refs.globeCanvas;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

        // Set initial size and resize handler
        function resizeCanvas() {
            const parent = canvas.parentElement;
            const newWidth = parent.offsetWidth ; // Make it half the width of the parent
            const newHeight = parent.offsetHeight;
            renderer.setSize(newWidth, newHeight);
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
        }

        resizeCanvas(); // Initial resize
        window.addEventListener("resize", resizeCanvas);

        const observer = new ResizeObserver(resizeCanvas);
        observer.observe(canvas.parentElement); // Observe the parent container for changes

        // Add sphere
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const texture = new THREE.TextureLoader().load("https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg");
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 0.1,
            roughness: 0.7,
        });
        const globe = new THREE.Mesh(geometry, material);
        scene.add(globe);

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

         // Add a dim background light for the globe
         const backgroundLight = new THREE.PointLight(0x404040, 0.1);
        backgroundLight.position.set(0, 0, -5);
        scene.add(backgroundLight);

        // Camera setup
        camera.position.z = 2;

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            globe.rotation.y += 0.001; // Slow down rotation
            renderer.render(scene, camera);
        }
        animate();
    },
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

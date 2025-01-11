<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { getHalmajData } from "../apiService"; // Halmaj API

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
);

// Kijelölt dátum
const selectedDate = ref(new Date().toISOString().split("T")[0]);

// Csak az elmúlt 3 nap engedélyezése
const minDate = ref(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
const maxDate = ref(new Date().toISOString().split("T")[0]);

// Chart adatok
const chartData = ref({
  labels: [] as string[],
  datasets: [] as any[],
});

const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
  },
  scales: {
    y1: {
      type: "linear",
      position: "left",
      title: {
        display: true,
      },
    },
    y2: {
      type: "linear",
      position: "right",
      grid: {
        drawOnChartArea: false, // Ez megakadályozza az átfedést
      },
      title: {
        display: true,
      },
    },
    x: {
      type: "category",
      title: {
        display: true,
      },
    },
  },
};

// API adatok lekérése
async function fetchHalmajData() {
  try {
    const data = await getHalmajData(); // Halmaj API hívás

    if (Array.isArray(data) && data.length > 0) {
      // Csak a kiválasztott nap adatait szűrjük
      const filteredData = data.filter((item) =>
        item.timestamp.startsWith(selectedDate.value)
      );

      // Időbélyegek formázása hh:mm formátumra
      const labels = filteredData.map((item) =>
        new Date(item.timestamp).toLocaleTimeString("hu-HU", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      // Termelési és besugárzási adatok
      const powerData = filteredData.map((item) => item.power_output || 0);
      const radiationData = filteredData.map((item) => item.total_radiation || 0);

      chartData.value = {
        labels,
        datasets: [
          {
            label: "Teljesítmény (kW)",
            data: powerData,
            borderColor: "#42A5F5",
            backgroundColor: "#90CAF9",
            fill: false,
            yAxisID: "y1",
          },
          {
            label: "Besugárzás (W/m^2)",
            data: radiationData,
            borderColor: "#FF7043",
            backgroundColor: "#FFCCBC",
            fill: false,
            yAxisID: "y2",
          },
        ],
      };
    } else {
      console.warn("Az API nem adott vissza adatokat a kiválasztott dátumra.");
      chartData.value = {
        labels: [],
        datasets: [],
      };
    }
  } catch (error) {
    console.error("Hiba történt az adatok lekérésekor:", error);
  }
}

// Figyelés a dátumváltozásra
onMounted(fetchHalmajData);
watch(selectedDate, fetchHalmajData);
</script>

<template>
  <section class="halmaj-chart-container">
    <h2>Halmajugra Termelés</h2>
    <div class="date-picker-container">
      <input
        type="date"
        v-model="selectedDate"
        :min="minDate"
        :max="maxDate"
      />
    </div>
    <Line :data="chartData" :options="chartOptions" />
  </section>
</template>

<style scoped>
.halmaj-chart-container {
  padding: 0em;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 400px;
}

.date-picker-container {
  margin-bottom: 10px;
}


canvas {
  max-height: 300px; /* Chart magasság korlátozása */
}
</style>

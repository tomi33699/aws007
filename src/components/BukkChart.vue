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
import { getBukkData } from "../apiService";

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
        text: "Teljesítmény (kW)",
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
        text: "Besugárzás (W/m^2)",
      },
    },
    x: {
      type: "category",
      title: {
        display: true,
        text: "Idő",
      },
    },
  },
};

// API adatok lekérése
async function fetchBukkData() {
  console.log("Lekérés indult a dátummal:", selectedDate.value);
  try {
    const data = await getBukkData(selectedDate.value);
    console.log("API válasz:", data);

    if (Array.isArray(data) && data.length > 0) {
      console.log("API által visszakapott összes adat:", data);

      const filteredData = data.filter((item) =>
        item.time.startsWith(selectedDate.value)
      );

      const labels = filteredData.map((item) =>
        new Date(item.time).toLocaleTimeString("hu-HU", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      const powerData = filteredData.map((item) => item.powerp * -1);
      const irradData = filteredData.map((item) => item.irrad || 0);
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
            data: irradData,
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
onMounted(fetchBukkData);
watch(selectedDate, fetchBukkData);
</script>

<template>
  <section class="bukk-chart-container">
    <h2>Bükkábrány termelés raw</h2>
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
.bukk-chart-container {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date-picker-container {
  align-self: flex-end;
  margin-bottom: 10px;
}
</style>

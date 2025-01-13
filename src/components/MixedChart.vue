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
import { getBukkData, getHalmajData } from "../apiService";

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
    x: {
      type: "category",
      title: {
        display: true,
      },
    },
  },
};

// Adatok lekérése és összegzése
async function fetchCombinedData() {
  try {
    const [bukkData, halmajData] = await Promise.all([
      getBukkData(selectedDate.value),
      getHalmajData(),
    ]);

    if (Array.isArray(bukkData) && Array.isArray(halmajData)) {
      // Dátum szűrés
      const filteredBukk = bukkData.filter((item) =>
        item.time.startsWith(selectedDate.value)
      );
      const filteredHalmaj = halmajData.filter((item) =>
        item.timestamp.startsWith(selectedDate.value)
      );

      // Időbélyeg egyesítés
      const labels = filteredBukk.map((item) =>
        new Date(item.time).toLocaleTimeString("hu-HU", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      // Adatok összegzése
      const totalPower = filteredBukk.map((item, index) =>
        item.powerp * -1 + (filteredHalmaj[index]?.power_output || 0)
      );
      const totalIrradiation = filteredBukk.map((item, index) =>
        (item.irrad || 0) + (filteredHalmaj[index]?.total_radiation || 0)
      );

      chartData.value = {
        labels,
        datasets: [
          {
            label: "Összesített Teljesítmény (kW)",
            data: totalPower,
            borderColor: "#42A5F5",
            backgroundColor: "#90CAF9",
            fill: false,
            yAxisID: "y1",
          },
          {
            label: "Összesített Besugárzás (W/m^2)",
            data: totalIrradiation,
            borderColor: "#FF7043",
            backgroundColor: "#FFCCBC",
            fill: false,
            yAxisID: "y1",
          },
        ],
      };
    } else {
      console.warn("Nem érkeztek adatok az API-tól.");
    }
  } catch (error) {
    console.error("Hiba történt az adatok lekérésekor:", error);
  }
}

// Figyelés a dátumváltozásra
onMounted(fetchCombinedData);
watch(selectedDate, fetchCombinedData);
</script>

<template>
  <section class="combined-chart-container">
    <h2>Összesített Termelés és Besugárzás</h2>
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
.combined-chart-container {
  padding: 1em;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date-picker-container {
  margin-bottom: 10px;
}

canvas {
  max-height: 400px;
}
</style>

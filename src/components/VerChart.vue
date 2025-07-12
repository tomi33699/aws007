<template>
  <div>
    <!-- Kártyák -->
    <div class="cards">
      <div class="card">
        <div class="icon"><i class="fas fa-bolt"></i></div>
        <div class="title">Tény</div>
        <div class="value">{{ last?.teny.toFixed(2) }} MW</div>
        <div class="time">{{ last?.time }}</div>
      </div>
      <div class="card">
        <div class="icon"><i class="fas fa-chart-line"></i></div>
        <div class="title">Terv</div>
        <div class="value">{{ last?.terv.toFixed(2) }} MW</div>
        <div class="delta" :class="getClass(last?.terv - last?.teny)">
          Eltérés: {{ formatDelta(last?.terv - last?.teny) }}
        </div>
      </div>
      <div class="card">
        <div class="icon"><i class="fas fa-pen"></i></div>
        <div class="title">Becslés</div>
        <div class="value">{{ last?.becsles.toFixed(2) }} MW</div>
        <div class="delta" :class="getClass(last?.becsles - last?.teny)">
          Eltérés: {{ formatDelta(last?.becsles - last?.teny) }}
        </div>
      </div>
    </div>

    <!-- Chart -->
    <VueApexCharts
      type="line"
      :options="chartOptions"
      :series="series"
      height="400"
      ref="chartRef"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { apiService } from "@/services/apiService";

const chartRef = ref(null);
const chartData = ref<any[]>([]);
const last = ref<{
  time: string;
  teny: number;
  terv: number;
  becsles: number;
} | null>(null);

const annotations = ref<any[]>([]);

onMounted(async () => {
  const today = new Date().toISOString().split("T")[0];
  try {
    const response = await apiService.getVerexportData(today);
    const raw = response.data.map((d: any) => ({
      ...d,
      timestamp: new Date(d.timestamp),
    }));
    chartData.value = raw;

    const index = [...raw].map(d => d.brutto_teny).reverse().findIndex(val => val > 0);
    if (index !== -1) {
      const i = raw.length - 1 - index;
      const point = raw[i];
      const time = point.timestamp.toLocaleTimeString("hu-HU", { hour: '2-digit', minute: '2-digit' });
      last.value = {
        time,
        teny: point.brutto_teny,
        terv: point.brutto_terv ?? 0,
        becsles: point.brutto_dayahead ?? 0,
      };
      annotations.value = [{
        x: time,
        borderColor: "#2563eb",
        label: {
          text: `Utolsó tény: ${point.brutto_teny.toFixed(0)} MW`,
          style: { background: "#2563eb", color: "#fff" }
        }
      }];
    }
  } catch (e) {
    console.error("❌ Hiba a verexport betöltésnél:", e);
  }
});

const chartOptions = computed(() => ({
  chart: {
    type: "line",
    zoom: { enabled: false },
    toolbar: { show: false },
  },
  annotations: {
    xaxis: annotations.value,
  },
  stroke: { width: [1.2, 1.2, 1.2], curve: "smooth" },
  xaxis: {
    categories: chartData.value.map(d =>
      d.timestamp.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })
    ),
    title: { text: "Idő" },
  },
  yaxis: {
    title: { text: "MW" },
  },
  tooltip: {
    y: { formatter: (val: number) => `${val.toFixed(2)} MW` }
  },
  colors: ["#2563eb", "#f97316", "#22c55e"],
}));

const series = computed(() => [
  {
    name: "Bruttó tény rendszerterhelés",
    data: chartData.value.map(d => d.brutto_teny > 0 ? d.brutto_teny : null),
  },
  {
    name: "Bruttó terv rendszerterhelés",
    data: chartData.value.map(d => d.brutto_terv ?? 0),
  },
  {
    name: "Bruttó becslés (dayahead)",
    data: chartData.value.map(d => d.brutto_dayahead ?? 0),
  },
]);

const formatDelta = (val: number | undefined) => {
  if (val === undefined) return "-";
  return `${val >= 0 ? "+" : ""}${val.toFixed(2)} MW`;
};

const getClass = (val: number | undefined) => {
  if (val === undefined) return "";
  return val > 0 ? "positive" : val < 0 ? "negative" : "neutral";
};
</script>

<style scoped>
.cards {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.card {
  flex: 1;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.icon {
  font-size: 1.8rem;
  margin-bottom: 0.2rem;
}
.title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.3rem;
}
.value {
  font-size: 1.4rem;
  font-weight: bold;
}
.time {
  font-size: 0.85rem;
  color: #555;
  margin-top: 0.3rem;
}
.delta {
  margin-top: 0.5rem;
  font-size: 0.95rem;
}
.positive {
  color: green;
}
.negative {
  color: red;
}
.neutral {
  color: #555;
}
</style>

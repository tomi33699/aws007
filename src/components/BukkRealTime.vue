<template>
  <div class="chart-container">
    <h2>Bükk Valós Idejű Adatok</h2>

    <!-- Dátumválasztó -->
    <label for="date-picker">Válassz egy dátumot:</label>
    <input id="date-picker" type="date" v-model="selectedDate" @change="fetchHistoricalData" />

    <!-- Utolsó frissítés és legutóbbi értékek -->
    <div class="stats">
      <p>Utolsó frissítés: <strong>{{ lastUpdated }}</strong></p>
      <p>Utolsó PowerP: <strong>{{ lastPowerP }} kW</strong></p>
      <p>Utolsó Irrad: <strong>{{ lastIrrad }} W/m²</strong></p>
    </div>

    <!-- 📈 Chart -->
    <apexchart type="line" height="400" :options="chartOptions" :series="chartSeries" />

    <!-- Ha nincs adat -->
    <p v-if="!chartSeries[0].data.length">Nincs adat a kiválasztott napra.</p>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { fetchBukkRawData } from "@/services/apiService";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    const selectedDate = ref(new Date().toISOString().split("T")[0]); // Alapértelmezett: mai nap
    const lastUpdated = ref("Nincs frissítés");
    const lastPowerP = ref("-");
    const lastIrrad = ref("-");
    let refreshInterval = null;

    const chartSeries = ref([
  { name: "PowerP", data: [], color: "#5B51BF" },
  { name: "Irrad", data: [], color: "#FAC107" },
]);

// Biztosítsd, hogy mindig legyen legalább egy üres adatsor:
const ensureChartDataStructure = () => {
  if (!chartSeries.value[0] || !Array.isArray(chartSeries.value[0].data)) {
    chartSeries.value[0] = { name: "PowerP", data: [], color: "#5B51BF" };
  }
  if (!chartSeries.value[1] || !Array.isArray(chartSeries.value[1].data)) {
    chartSeries.value[1] = { name: "Irrad", data: [], color: "#FAC107" };
  }
};

    // ApexChart beállítások
    const chartOptions = ref({
      chart: {
        type: "line",
        zoom: {
          enabled: false,  // 🔥 Kijelöléssel zoomolás engedélyezve
          type: "x",  // 🔥 Csak az X tengelyen
          autoScaleYaxis: false, 
        },
        toolbar: {
          tools: {
            zoomin: false, // 🔒 Nem lehet nagyítani görgővel
            zoomout: false, // 🔒 Nem lehet kicsinyíteni görgővel
            pan: false, // 🔒 Nem lehet mozgatni a chartot
            reset: true, // 🔄 Reset gomb engedélyezve
          },
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          formatter: (value) =>
            new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        },
      },
      yaxis: [
        {
          title: { text: "PowerP (kW)" },
          labels: {
            formatter: (value) => `${value} kW`,
          },
        },
        {
          opposite: true,
          title: { text: "Irrad (W/m²)" },
          labels: {
            formatter: (value) => `${value} W/m²`,
          },
        },
      ],
      tooltip: { shared: true, intersect: false },
    });

    // **📌 Történelmi adatok betöltése**
    const fetchHistoricalData = async () => {
  try {
    const response = await fetchBukkRawData(selectedDate.value);
    if (!Array.isArray(response) || response.length === 0) {
      console.warn("[fetchHistoricalData] Nincs adat erre a dátumra:", selectedDate.value);
      chartSeries.value[0].data = [];
      chartSeries.value[1].data = [];
      return;
    }

    // **Mezők validálása**: Ellenőrizzük, hogy az adatok minden szükséges mezővel rendelkeznek-e
    const cleanedData = response.filter(item => 
      item && typeof item === 'object' && 'time' in item && 'powerp' in item && 'irrad' in item
    );

    if (cleanedData.length === 0) {
      console.warn("[fetchHistoricalData] Nincs megfelelő formátumú adat:", response);
      chartSeries.value[0].data = [];
      chartSeries.value[1].data = [];
      return;
    }

    chartSeries.value[0].data = cleanedData.map((item) => ({
      x: new Date(item.time).getTime(),
      y: Math.abs(parseFloat(item.powerp.toFixed(2))),
    }));

    chartSeries.value[1].data = cleanedData.map((item) => ({
      x: new Date(item.time).getTime(),
      y: parseFloat(item.irrad.toFixed(2)),
    }));

    updateLastValues();
  } catch (error) {
    console.error("[fetchHistoricalData] Hiba történt az adatlekérés közben:", error);
  }
};



    // **📌 Legutóbbi értékek frissítése**
    const updateLastValues = () => {
  lastPowerP.value = chartSeries.value[0].data.length
    ? chartSeries.value[0].data[chartSeries.value[0].data.length - 1].y
    : "-";

  lastIrrad.value = chartSeries.value[1].data.length
    ? chartSeries.value[1].data[chartSeries.value[1].data.length - 1].y
    : "-";

  lastUpdated.value = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};


    onMounted(() => {
      fetchHistoricalData();
      refreshInterval = setInterval(() => {
        fetchHistoricalData();
      }, 10000); // **⬅️ 10 másodpercenként frissítés**
    });

    onUnmounted(() => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    });

    return {
      selectedDate,
      lastUpdated,
      lastPowerP,
      lastIrrad,
      chartSeries,
      chartOptions,
      fetchHistoricalData,
    };
  },
};
</script>

<style scoped>
.chart-container {
  padding: 1em;
  background-color: #ffffff;
  border-radius: 10px;
  min-height: 30em;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 0.5em;
  color: #333;
}

label {
  margin-right: 10px;
}

input[type="date"] {
  margin-bottom: 20px;
  padding: 5px;
  font-size: 16px;
}

.stats {
  margin: 10px 0;
  font-size: 16px;
}
</style>

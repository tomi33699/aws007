<template>
  <div class="chart-container">
    <h2 class="chart-title">Napi Termelés Oszlopdiagram</h2>

    <div class="summary-cards">
      <div class="summary-card">
        <i class="fas fa-solar-panel icon"></i>
        <h3><b>Bükk havi összeg</b></h3>
        <p>{{ formatNumber(totalBukk / 1000) }} MWh</p>
      </div>
      <div class="summary-card">
        <i class="fas fa-bolt icon"></i>
        <h3><b>Halmaj havi összeg</b></h3>
        <p>{{ formatNumber(totalHalmaj / 1000) }} MWh</p>
      </div>
    </div>

    <input v-model="selectedMonth" type="month" @change="fetchData" class="month-picker" />
    <apexchart type="bar" :options="chartOptions" :series="series" height="400"></apexchart>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import apiService from '@/services/apiService';
import VueApexCharts from 'vue3-apexcharts';

export default {
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    const selectedMonth = ref(new Date().toISOString().slice(0, 7));
    const totalBukk = ref(0);
    const totalHalmaj = ref(0);

    const series = ref([
      { name: "Bükk", data: [] },
      { name: "Halmaj", data: [] },
    ]);

    const chartOptions = ref({
      chart: {
        type: "bar",
        height: 400,
        toolbar: { show: true },
        zoom: { enabled: false }, // 🔴 Zoom kikapcsolva
      },
      plotOptions: {
        bar: {
          columnWidth: "40%",
          borderRadius: 4,
          barHeight: "80%",
        },
      },
      colors: ["#5C52BF", "#FAC108"],
      dataLabels: {
        enabled: false, // 🔴 Adatfeliratok kikapcsolva
      },
      xaxis: {
        type: "category",
        tickPlacement: "on",
        labels: {
          rotate: -45,
          style: { fontSize: "12px" },
        },
      },
      yaxis: {
        labels: {
          formatter: (val) => `${Math.round(val / 1000)} MWh`,
        },
      },
      tooltip: {
        y: {
          formatter: (val) => `${Math.round(val / 1000)} MWh`, // Tooltipben továbbra is látszik az adat
        },
      },
      legend: {
        position: "top",
      },
    });

    const fetchData = async () => {
      try {
        const bukkData = await apiService.fetchBukkDailyData();
        const halmajData = await apiService.fetchHalmajDailyData();

        const daysInMonth = new Date(
          selectedMonth.value.split("-")[0],
          selectedMonth.value.split("-")[1],
          0
        ).getDate();

        const allDates = Array.from({ length: daysInMonth }, (_, i) => {
          const day = (i + 1).toString().padStart(2, "0");
          return `${selectedMonth.value}-${day}`;
        });

        const bukkMap = Object.fromEntries(
          bukkData.map((item) => [item.date, parseFloat(item.daily_powerp) || 0])
        );
        const halmajMap = Object.fromEntries(
          halmajData.map((item) => [item.date, parseFloat(item.daily_powerp) || 0])
        );

        series.value[0].data = allDates.map((date) => bukkMap[date] || 0);
        series.value[1].data = allDates.map((date) => halmajMap[date] || 0);
        chartOptions.value.xaxis.categories = allDates.map(
          (date) => date.split("-")[2]
        );

        totalBukk.value = series.value[0].data.reduce((sum, val) => sum + val, 0) || 0;
        totalHalmaj.value = series.value[1].data.reduce((sum, val) => sum + val, 0) || 0;
      } catch (error) {
        console.error("Hiba az adatok lekérésekor:", error);
      }
    };

    watch(selectedMonth, fetchData);
    onMounted(fetchData);

    const formatNumber = (num) => {
      return num.toLocaleString("hu-HU", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    };

    return { selectedMonth, series, chartOptions, fetchData, totalBukk, totalHalmaj, formatNumber };
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

.chart-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.month-picker {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 20px;
}

.summary-cards {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 20px;
}

.summary-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon {
  font-size: 24px;
  color: #5C52BF;
}



@media screen and (max-width: 768px) {
  .chart-container{
    text-align: center;
    padding: 1em 0;
  }
  .summary-cards {
    display: block;
    justify-items: center;
  }
}
</style>

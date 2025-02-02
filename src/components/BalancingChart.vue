<template>
  <div class="chart-container">
    <h2>
      Balancing Adatok (aktiválás átlagárak)
      <p class="last-updated">Utoljára frissítve: {{ lastUpdated }}</p>
    </h2>

    <div class="price-card-container">
      <div class="card">
        <div class="card-content">
          <div class="card-icon"><i class="fas fa-calendar"></i></div>
          <div class="card-text">
            <h4 class="card-title"><strong>Dátum:</strong> </h4>
            <p class="card-value">{{ latestTimestamp }} <span class="unit"></span></p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-content">
          <div class="card-icon"><i class="fas fa-arrow-up"></i></div>
          <div class="card-text">
            <h4 class="card-title"><strong>Up Price:</strong></h4>
            <p class="card-value">{{ latestUpPrice }} <span class="unit">Ft/kWh</span></p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-content">
          <div class="card-icon"><i class="fas fa-arrow-down"></i></div>
          <div class="card-text">
            <h4 class="card-title"><strong>Down Price:</strong></h4>
            <p class="card-value">{{ latestDownPrice }} <span class="unit">Ft/kWh</span></p>
          </div>
        </div>
      </div>
    </div>

    <label for="date-picker-balancing">Dátumválasztás:</label>
    <input id="date-picker-balancing" type="date" v-model="selectedDate" @change="fetchData" class="date-picker" />
    <apexchart type="line" height="400" :options="chartOptions" :series="chartSeries" />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import apiService from '@/services/apiService';

export default {
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    const selectedDate = ref(new Date().toISOString().split('T')[0]);
    const chartSeries = ref([]);
    const lastUpdated = ref("Nincs adat");
    const latestUpPrice = ref("N/A");
    const latestDownPrice = ref("N/A");
    const latestTimestamp = ref("N/A");
    let refreshInterval = null;

    const chartOptions = ref({
      chart: {
        type: "line",
        zoom: { enabled: false },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 300,
          dynamicAnimation: { enabled: true, speed: 1200 },
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          formatter: (value) =>
            new Date(value).toLocaleTimeString("hu-HU", {
              hour: "2-digit",
              minute: "2-digit",
            }),
        },
      },
      yaxis: [
        {
          title: { text: "Price (Ft/kWh)" },
          labels: {
            formatter: (value) => new Intl.NumberFormat("hu-HU").format((value / 1000).toFixed(3)) + " Ft/kWh",
          },
        }
      ],
      stroke: {
        curve: 'smooth',
      },
      markers: {
        size: 5,
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      colors: ['#FAC108', '#4B42A1']
    });

    const fetchData = async () => {
      try {
        const dateParam = selectedDate.value;
        const priceData = await apiService.fetchFromApi('/balancing_activated_price', { date: dateParam });

        chartSeries.value = [
          {
            name: 'Up Price',
            type: 'line',
            data: priceData.map(d => ({ x: new Date(d.date).getTime() + (8 * 15 * 60 * 1000), y: d.up_price }))
          },
          {
            name: 'Down Price',
            type: 'line',
            data: priceData.map(d => ({ x: new Date(d.date).getTime() + (8 * 15 * 60 * 1000), y: -d.down_price }))
          }
        ];

        if (priceData.length > 0) {
          latestTimestamp.value = new Date(new Date(priceData[priceData.length - 1].date).getTime() + (8 * 15 * 60 * 1000)).toLocaleString("hu-HU", {
            year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"
          });
          latestUpPrice.value = (priceData[priceData.length - 1].up_price / 1000).toFixed(3);
          latestDownPrice.value = (priceData[priceData.length - 1].down_price / 1000).toFixed(3);
        }

        lastUpdated.value = new Date().toLocaleTimeString("hu-HU", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    onMounted(() => {
      fetchData();
      refreshInterval = setInterval(() => {
        fetchData();
      }, 60000);
    });

    onUnmounted(() => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    });

    return {
      latestTimestamp,
      selectedDate,
      chartSeries,
      chartOptions,
      lastUpdated,
      latestUpPrice,
      latestDownPrice,
      fetchData,
    };
  }
};
</script>

<style scoped>
.chart-container {
  padding: 1em;
  background-color: #ffffff;
  border-radius: 10px;
  min-height: 30em;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  overflow-x: hidden;
  margin: 1em 0;
}

h2 {
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.last-updated {
  font-size: 14px;
  color: #777;
}

.price-card-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5em;
  margin: 1em 0;
}

.card {
  display: flex;
  align-items: center;
  background-color: #1A1A2E;
   padding: 1em;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-align: left;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
}

.card-content {
  width: 100%;
  display: grid;
  grid-template-columns: 0.6fr 1.4fr;
  align-items: center;
}

.card-icon {
  font-size: 1.8em;
  color: #FAC108;
  text-align: center;
  background: linear-gradient(135deg, #5C52BF, #332D78);
  /* Modern színátmenet */
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.15);
}

.card-title {
  color: #ffffff;
  font-weight: 600;
  font-size: 1em;
  margin-bottom: 5px;
}

.card-value {
  font-weight: bold;
  color: #FAC108;
  font-size: 1.3em;
  margin: 0;
}

.unit {
  font-size: 0.9em;
  color: #E0E0E0;
  margin-left: 5px;
}


label {
  margin-right: 10px;
}

input[type="date"] {
  margin-bottom: 20px;
  padding: 5px;
  font-size: 16px;
}



@media screen and (max-width: 768px) {
  .chart-container{
    padding: 1em 0;
    text-align: center;
  }
 .price-card-container{
  width: 90%;
  margin: auto;
  padding: 1em 0;
  grid-template-columns: 1fr;
  gap: .5em;
 }
 h2{
  display: block;
 }
}
</style>
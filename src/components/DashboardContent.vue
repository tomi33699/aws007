<!-- DashboardContent.vue -->
<script setup lang="ts">
import BukkChart from "./BukkChart.vue"; 
import CardComponent from './CardComponent.vue';
import SolarDashboard from './SolarDashboard.vue';

import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
} from 'chart.js';
import 'material-icons/iconfont/material-icons.css';
import HalmajChart from "./HalmajChart.vue";


ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
);

const props = defineProps(['activeMenu']);

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Termelés (kW)',
      data: [1000, 1200, 1300, 1250, 1400, 1500],
      borderColor: '#42A5F5',
      backgroundColor: '#90CAF9',
      fill: true,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
  },
};
</script>

<template>
  <section class="content">
    
    <div v-if="props.activeMenu === 'Főoldal'">
      <SolarDashboard />
      <CardComponent />
      <div class="chart-container">
        <BukkChart />
      </div>
      <div class="chart-container">
        <HalmajChart />
      </div>
    </div>
  </section>
</template>

<style scoped>
.content {
  flex-grow: 1;
  padding: 1em;
  background: #d7d7d7;
  overflow-y: auto;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 1em;
}

.card {
  padding: 1em;
  background: white;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.card-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.card-title {

  margin-bottom: 5px;
}

.card-value {

  font-weight: bold;
}

.card-icon {
  font-size: 1em;
  color: #34495e;
}

.chart-container {
  background: white;
  margin: 1em 0;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>

<!-- DashboardContent.vue -->
<script setup lang="ts">
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
    <h1>{{ props.activeMenu }}</h1>

    <div v-if="props.activeMenu === 'Főoldal'">
      <div class="cards">
        <div class="card">
          <div class="card-content">
            <div class="card-text">
              <span class="card-title">Termelés</span>
              <span class="card-value">1000 kW</span>
            </div>
            <span class="material-icons card-icon">bolt</span>
          </div>
        </div>
        <div class="card">
          <div class="card-content">
            <div class="card-text">
              <span class="card-title">Fogyasztás</span>
              <span class="card-value">800 kW</span>
            </div>
            <span class="material-icons card-icon">flash_on</span>
          </div>
        </div>
        <div class="card">
          <div class="card-content">
            <div class="card-text">
              <span class="card-title">Tartalék</span>
              <span class="card-value">200 kW</span>
            </div>
            <span class="material-icons card-icon">inventory</span>
          </div>
        </div>
        <div class="card">
          <div class="card-content">
            <div class="card-text">
              <span class="card-title">Import</span>
              <span class="card-value">500 kW</span>
            </div>
            <span class="material-icons card-icon">arrow_upward</span>
          </div>
        </div>
        <div class="card">
          <div class="card-content">
            <div class="card-text">
              <span class="card-title">Export</span>
              <span class="card-value">300 kW</span>
            </div>
            <span class="material-icons card-icon">arrow_downward</span>
          </div>
        </div>
        <div class="card">
          <div class="card-content">
            <div class="card-text">
              <span class="card-title">Egyenleg</span>
              <span class="card-value">+200 kW</span>
            </div>
            <span class="material-icons card-icon">assessment</span>
          </div>
        </div>
      </div>
      <div class="chart-container">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.content {
  flex-grow: 1;
  padding: 20px;
  background: linear-gradient(180deg, #ecf0f1, #a29bfe);
  overflow-y: auto;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.card {
  padding: 20px;
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
  font-weight: bold;
  margin-bottom: 5px;
}

.card-value {
  font-size: 1.2em;
  font-weight: bold;
}

.card-icon {
  font-size: 2em;
  color: #34495e;
}

.chart-container {
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>

<script setup lang="ts">
import { defineProps } from "vue";

// Props definiálása alapértelmezett értékekkel
defineProps({
  latestHalmajPower: { type: Number, default: 0 },
  latestHalmajIrrad: { type: Number, default: 0 },
  latestBukkPower: { type: Number, default: 0 },
  latestBukkIrrad: { type: Number, default: 0 },
  latestSumPower: { type: Number, default: 0 },
  latestTimestamp: { type: String, default: "N/A" },
  dailyBukkPower: { type: Number, default: 0 },
  dailyHalmajPower: { type: Number, default: 0 },
  dailySumPower: { type: Number, default: 0 },
});
</script>

<template>
  <div class="card-container">
    <div class="card">
      <div class="icon bg-blue"><i class="fas fa-calendar-alt"></i></div>
      <p>Utolsó adat időpontja:</p>
      <strong>{{ latestTimestamp }}</strong>
    </div>

    <div class="card">
      <div class="icon bg-lightblue"><i class="fas fa-bolt"></i></div>
      <p>Halmaj Power:</p>
      <strong>{{ latestHalmajPower }} kW</strong>
    </div>

    <div class="card">
      <div class="icon bg-yellow"><i class="fas fa-sun"></i></div>
      <p>Halmaj Irrad:</p>
      <strong>{{ latestHalmajIrrad }}</strong>
    </div>

    <div class="card">
      <div class="icon bg-lightblue"><i class="fas fa-bolt"></i></div>
      <p>Bükk Power:</p>
      <strong>{{ latestBukkPower }} kW</strong>
    </div>

    <div class="card">
      <div class="icon bg-yellow"><i class="fas fa-sun"></i></div>
      <p>Bükk Irrad:</p>
      <strong>{{ latestBukkIrrad }}</strong>
    </div>

    <div class="card">
      <div class="icon bg-orange"><i class="fas fa-battery-full"></i></div>
      <p>Összesített Power:</p>
      <strong>{{ latestSumPower }} kW</strong>
    </div>

    <!-- Napi termelési adatok -->
    <div class="card">
      <div class="icon bg-green"><i class="fas fa-chart-line"></i></div>
      <p>Napi Bükk Termelés:</p>
      <strong>{{ dailyBukkPower }} kWh</strong>
    </div>

    <div class="card">
      <div class="icon bg-green"><i class="fas fa-chart-line"></i></div>
      <p>Napi Halmaj Termelés:</p>
      <strong>{{ dailyHalmajPower }} kWh</strong>
    </div>

    <div class="card total-card">
      <div class="icon bg-blue"><i class="fas fa-bolt"></i></div>
      <p>Napi Összesített Termelés:</p>
      <strong>{{ dailySumPower }} kWh</strong>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 10px;
}

.card {
  background: #ffffff;
  color: #1e293b;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 4px 6px 8px rgba(0, 0, 0, 0.15);
}

/* Ikonok */
.icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  margin-bottom: 8px;
}

/* Színes ikon háttér */
.bg-blue { background: #007bff; }
.bg-lightblue { background: #4A90E2; }
.bg-yellow { background: #f4c542; }
.bg-orange { background: #ff7f00; }
.bg-green { background: #28a745; }

/* Kiemelt kártya */
.total-card {
  background: #ffffff;
  color: #007bff;
  border: 2px solid #007bff;
}
</style>

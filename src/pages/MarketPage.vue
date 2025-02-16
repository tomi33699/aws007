<template>
  <div class="charts-page">
    <BalancingPriceChart />
    <HourlyHUPXChart />
  </div>
</template>

<script setup lang="ts">
import BalancingPriceChart from '@/components/BalancingPriceChart.vue';
import HourlyHUPXChart from '@/components/HourlyHUPXChart.vue';
</script>

<style scoped>
.charts-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}
</style>

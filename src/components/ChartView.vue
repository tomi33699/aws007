<template>
  <div class="chart-container">
    <BukkChart class="chart-item" />
    <HalmajChart class="chart-item" />
  </div>
</template>

<script>
import BukkChart from "@/components/BukkChart.vue";
import HalmajChart from "@/components/HalmajChart.vue";

export default {
  components: {
    BukkChart,
    HalmajChart,
  },
};
</script>

<style scoped>
.chart-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  padding: 1em;
  margin: 1em 0;
  width: 100%;
  max-width: 100%;
  overflow: hidden; /* Megakadályozza a csúszkát */
}

.chart-item {
  min-width: 0; /* Flex/Grid esetén segít elkerülni a túlnyúlást */
  width: 100%;
}
</style>

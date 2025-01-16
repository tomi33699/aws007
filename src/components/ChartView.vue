<template>
  <div class="chart-container">
    <BukkChart />
    <HalmajChart />
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
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 0em;
  margin: 1em 0;
}
</style>

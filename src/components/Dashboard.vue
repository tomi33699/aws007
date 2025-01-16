<template>
    <div class="dashboard">
      <ActualDataView />
      <ChartView />
    </div>
  </template>
  
  <script>
  import ActualDataView from './ActualDataView.vue';
  import ChartView from './ChartView.vue';
  
  export default {
    components: {
      ActualDataView,
      ChartView,
    },
  };
  </script>
  
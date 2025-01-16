<template>
    <div class="card-view">
      <div v-if="!isLoading">
        <div class="card" v-for="(value, key) in actualData" :key="key">
          <h3>{{ key }}</h3>
          <p>{{ value }}</p>
        </div>
      </div>
      <div v-else>Loading...</div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useDataStore } from '../store/dataStore';
  
  export default {
    setup() {
      const store = useDataStore();
      const actualData = computed(() => store.state.actualData);
      const isLoading = computed(() => store.state.isLoading);
  
      return {
        actualData,
        isLoading,
      };
    },
  };
  </script>
  
<template>
    <div class="current-state-container">
      <div class="header">
        <font-awesome-icon icon="info-circle" class="header-icon" />
        <span>Current State</span>
      </div>
  
      <div class="state-diagram">
        <div class="circle yield">
          <font-awesome-icon icon="solar-panel" class="icon" />
          <p>{{ yieldPower }} W</p>
          <span>Yield</span>
        </div>
  
        <div class="circle total-power">
          <font-awesome-icon icon="bolt" class="icon" />
          <p>{{ totalPower }} W</p>
          <span>Total Power</span>
        </div>
  
        <div class="circle load">
          <font-awesome-icon icon="home" class="icon" />
          <p>{{ totalLoad }} W</p>
          <span>Load</span>
        </div>
  
        <!-- Összekötő vonalak -->
        <div class="connections">
          <div class="line line1"></div>
          <div class="line line2"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { getBukkData, getHalmajData } from "@/services/apiService";
  
  const yieldPower = ref(0);
  const totalPower = ref(0);
  const totalLoad = ref(0);
  
  const fetchLatestData = async () => {
    try {
      const bukkResponse = await getBukkData(new Date().toISOString().slice(0, 10));
      const halmajResponse = await getHalmajData(new Date().toISOString().slice(0, 10));
  
      if (bukkResponse.length > 0) {
        yieldPower.value = Math.round(bukkResponse.at(-1)?.powerp_kw || 0);
      }
  
      if (halmajResponse.length > 0) {
        totalLoad.value = Math.round(halmajResponse.at(-1)?.powerp_kw || 0);
      }
  
      totalPower.value = yieldPower.value + totalLoad.value;
    } catch (error) {
      console.error("❌ Hiba az adatok lekérésekor:", error);
    }
  };
  
  onMounted(() => {
    fetchLatestData();
    setInterval(fetchLatestData, 60000); // Frissítés 1 percenként
  });
  </script>
  
  
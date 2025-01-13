<script setup lang="ts">
import { ref, onMounted } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import { getHupxData } from "../apiService";

// Naptár események
const events = ref<{ title: string; date: string }[]>([]);

// Adatok lekérése az API-ról
async function fetchHupxData() {
  try {
    const data = await getHupxData();
    if (Array.isArray(data)) {
      events.value = data.map((item) => ({
        title: `${item.avgPrice.toFixed(2)} €/MWh`, // Ár formázása
        date: item.date, // Dátum
      }));
    } else {
      console.warn("Nem érkezett adat az API-tól.");
    }
  } catch (error) {
    console.error("Hiba történt a HUPX adatok lekérésekor:", error);
  }
}

// Adatok betöltése
onMounted(fetchHupxData);
</script>

<template>
  <section class="hupx-calendar-container">
    <h2>HUPX Átlagár Naptár</h2>
    <FullCalendar
      :plugins="[dayGridPlugin]"
      initialView="dayGridMonth"
      :events="events"
    />
  </section>
</template>

<style scoped>
.hupx-calendar-container {
  padding: 1em;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  margin-bottom: 1em;
}
</style>

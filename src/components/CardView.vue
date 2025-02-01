<template>
  <div class="card-view">
    <div v-for="(item, title) in cardData" :key="title" class="card">
      <div class="card-content">
        <div class="card-icon">
          <i :class="getIconClass(title)"></i>
        </div>
        <div class="card-text">
          <h4 class="card-title">{{ title }}</h4>
          <p class="card-value">{{ item.value }} <span class="unit">{{ item.unit }}</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineProps } from "vue";

const icons = {
  "Aktuális termelés (Bükkábrány)": "fas fa-bolt", // Villám ikon
  "Aktuális besugárzás (Halmajugra)": "fas fa-sun", // Nap ikon
  "Aktuális termelés (Halmajugra)": "fas fa-bolt", // Villám ikon
  "Aktuális besugárzás (Bükkábrány)": "fas fa-sun", // Nap ikon
  "Aktuális termelés (Portfolio)": "fas fa-solar-panel", // Napelem ikon
  "Aktuális besugárzás (Portfolio)": "fas fa-sun", // Napfény ikon
};

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    cardData() {
      return {
        "Aktuális termelés (Portfolio)": {
          value: this.data.pv_prod_actual?.toFixed(2) || "N/A",
          unit: "kW",
        },
        "Aktuális termelés (Bükkábrány)": {
          value: this.data.bukk_prod_actual?.toFixed(2) || "N/A",
          unit: "kW",
        },
        "Aktuális termelés (Halmajugra)": {
          value: this.data.halmaj_prod_actual?.toFixed(2) || "N/A",
          unit: "kW",
        },
        "Aktuális besugárzás (Portfolio)": {
          value: this.data.pv_irrad_actual?.toFixed(2) || "N/A",
          unit: "W/m²",
        },
        "Aktuális besugárzás (Halmajugra)": {
          value: this.data.bukk_irrad_actual?.toFixed(2) || "N/A",
          unit: "W/m²",
        },
        "Aktuális besugárzás (Bükkábrány)": {
          value: this.data.halmaj_irrad_actual?.toFixed(2) || "N/A",
          unit: "W/m²",
        },
      };
    },
  },
  methods: {
    getIconClass(title) {
      return icons[title] || "fas fa-sun"; // Alapértelmezett ikon
    },
  },
};
</script>

<style scoped>
.card-view {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5em;
  margin: 0 1em;
}

.card {
  display: flex;
  align-items: center;
  background-color: #1A1A2E; /* Sötétebb háttér, illik a dashboardhoz */
  padding: 1.2em;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-align: left;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
}

.card-content {
  width: 100%;
  display: grid;
  grid-template-columns: 0.6fr 1.4fr;
  align-items: center;
}

.card-icon {
  font-size: 1.8em;
  color: #FAC108;
  text-align: center;
  background: linear-gradient(135deg, #5C52BF, #332D78); /* Modern színátmenet */
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.15);
}

.card-title {
  color: #ffffff;
  font-weight: 600;
  font-size: 1em;
  margin-bottom: 5px;
}

.card-value {
  font-weight: bold;
  color: #FAC108;
  font-size: 1.3em;
  margin: 0;
}

.unit {
  font-size: 0.9em;
  color: #E0E0E0;
  margin-left: 5px;
}
</style>

<template>
  <div class="card-view">
    <div v-for="(item, title) in cardData" :key="title" class="card">
      <div class="card-content">
        <div class="card-icon">
          <i :class="getIconClass(title)"></i>
        </div>
        <div>
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
  grid-template-columns: repeat(auto-fit, minmax(1em, 1fr));
  gap: 1em;
  margin: 0 1em;
}

.card {
  display: flex;
  align-items: center;
  background-color: #ebebeb;
  padding: 1em;
  border-radius: 10px;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: left;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 4px 6px 8px rgba(0, 0, 0, 0.15);
}

.card-content {
  width: 100%;
  display: grid;
  grid-template-columns: 0.8fr 1.6fr;
  align-content: center;
}

.card-icon {
  font-size: 1.5em;
  color: #fac107;
  text-align: center;
  background: #333333;
  width: 50%;
  height: 100%;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-title {
  color: #333333;
  margin: 0;
}

.card-value {
  font-weight: bold;
  color: #5b51bf;
  margin: 5px 0 0;
}

.unit {
  font-size: 0.9em;
  color: #666;
  margin-left: 5px;
}
</style>
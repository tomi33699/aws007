<template>
  <div class="card-view">
    <div v-for="(value, title) in cardData" :key="title" class="card">
      <div class="card-content">
        <div class="card-icon">
          <i :class="getIconClass(title)"></i>
        </div>
        <div>
          <h4 class="card-title">{{ title }}</h4>
          <p class="card-value">{{ value }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineProps } from "vue";

const icons = {
  "Bükk Prod Actual (kW)": "fas fa-solar-panel", // Solar panel icon
  "Bükk Irrad Actual (kW/m²)": "fas fa-sun", // Sunshine icon
  "Halmaj Prod Actual (kW)": "fas fa-industry", // Industry/production icon
  "Halmaj Irrad Actual (kW/m²)": "fas fa-cloud-sun", // Cloudy sunshine icon
  "PV Production Actual (kW)": "fas fa-bolt", // Lightning bolt for energy
  "PV Irrad Actual (kW/m²)": "fas fa-lightbulb", // Light bulb for irradiation
/*   "HUPX Price Actual (€/MWh)": "fas fa-euro-sign", // Euro currency icon
 */};

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
        "Bükk Prod Actual (kW)": Math.abs(this.data.bukk_prod_actual)?.toFixed(2) || "N/A",
        "Halmaj Prod Actual (kW)": this.data.halmaj_prod_actual?.toFixed(2) || "N/A",
        "PV Production Actual (kW)": Math.abs(this.data.pv_prod_actual)?.toFixed(2) || "N/A",
        "Bükk Irrad Actual (kW/m²)": this.data.bukk_irrad_actual?.toFixed(2) || "N/A",
        "Halmaj Irrad Actual (kW/m²)": this.data.halmaj_irrad_actual?.toFixed(2) || "N/A",
        "PV Irrad Actual (kW/m²)": this.data.pv_irrad_actual?.toFixed(2) || "N/A",
/*         "HUPX Price Actual (€/MWh)": this.data.hupx_price_actual?.toFixed(2) || "N/A",
 */      };
    },
  },
  methods: {
    getIconClass(title) {
      return icons[title] || "fas fa-exclamation-circle"; // Fallback icon
    },
  },
};
</script>

<style scoped>
.card-view {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1em 2em;
  margin: 1em 0;
}

.card {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding: 1em;
  border-radius: 10px;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: left;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 4px 6px 10px rgba(0, 0, 0, 0.2);
}

.card-content {
  width: 100%;
  display: grid;
  grid-template-columns: .8fr 1.6fr;
  align-content: center;
}

.card-icon {  
  font-size: 1.2em;
  color: #FAC107;
  align-content: center;
  text-align: center;
  background: #333333;
  width: 50%;
  height: 100%;
  border-radius: 10px;
}

.card-title {

  color: #333333;
  margin: 0;
}

.card-value {
  font-weight: bold;
  color: #5B51BF;
  margin: 5px 0 0;
}
</style>



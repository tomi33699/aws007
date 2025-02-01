<template>
  <div class="banner-container">
    <div class="banner-header">
      <h2>PV Monitoring <span class="green">(Aktív)</span></h2>
    </div>
    <div class="banner-body">
      <div class="banner-left">
        <div class="info-block">
          <p><span class="badge-dot bg-success"></span>Hupx ár</p>
          <h2>{{ hupxPrice.toFixed(2) }} EUR/MWh</h2>
          <p>Dátum: {{ hupxDate }}</p>
        </div>
        <hr class="my-35" />

        <div class="info-block">
          <p><span class="badge-dot bg-warning"></span> Gáz ár TTF</p>
          <h2>51.11 EUR/MWh</h2>
          <p>Dátum: {{ hupxDate }}</p>
        </div>
      </div>

      <div class="banner-right">
        <img src="@/assets/solar-panel.png" alt="Solar Panel" class="banner-img" />
        <div class="stats-box">
          <div class="stat-item">
            <i class="fas fa-solar-panel text-success"></i>
            <div>
              <p>Napi termelés</p>
              <h5>{{ formatNumber(dailyPortfolioPower / 1000) }} MWh</h5>
            </div>
          </div>
          <div class="stat-item">
            <i class="fas fa-battery-full text-warning"></i>
            <div>
              <p>Havi termelés</p>
              <h5>{{ formatNumber(monthlyPortfolioPower / 1000) }} MWh</h5>            
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchBukkDailyData, fetchHalmajDailyData, getHupxData } from "@/services/apiService";

export default {
  name: "Banner",
  data() {
    return {
      hupxPrice: 0,
      hupxDate: "",
      dailyPortfolioPower: 0, // Napi összesített termelés
      monthlyPortfolioPower: 0, // Havi összesített termelés
    };
  },
  async mounted() {
    await this.fetchHupxPrice();
    await this.fetchPortfolioPower();
  },
  methods: {
    async fetchHupxPrice() {
      try {
        const hupxData = await getHupxData();
        if (Array.isArray(hupxData) && hupxData.length > 0) {
          const latestDate = hupxData[hupxData.length - 1].date;
          const avgPrice = hupxData
            .filter(entry => entry.date === latestDate)
            .reduce((sum, entry) => sum + entry.price, 0) / hupxData.filter(entry => entry.date === latestDate).length;
          
          this.hupxPrice = parseFloat(avgPrice.toFixed(2));
          this.hupxDate = latestDate;
        }
      } catch (error) {
        console.error("Error fetching HUPX price:", error);
      }
    },

    async fetchPortfolioPower() {
      try {
        const bukkDaily = await fetchBukkDailyData();
        const halmajDaily = await fetchHalmajDailyData();

        const today = new Date().toISOString().split("T")[0]; // Aktuális dátum YYYY-MM-DD formátumban
        const currentMonth = today.slice(0, 7); // Aktuális hónap YYYY-MM formátumban

        // Napi teljesítmény számítása
        const bukkToday = bukkDaily.find(entry => entry.date === today)?.daily_powerp || 0;
        const halmajToday = halmajDaily.find(entry => entry.date === today)?.daily_powerp || 0;
        this.dailyPortfolioPower = (bukkToday + halmajToday);

        // Havi teljesítmény számítása
        const bukkMonthly = bukkDaily
          .filter(entry => entry.date.startsWith(currentMonth))
          .reduce((sum, entry) => sum + entry.daily_powerp, 0);

        const halmajMonthly = halmajDaily
          .filter(entry => entry.date.startsWith(currentMonth))
          .reduce((sum, entry) => sum + entry.daily_powerp, 0);

        this.monthlyPortfolioPower = (bukkMonthly + halmajMonthly);

      } catch (error) {
        console.error("Error fetching portfolio power data:", error);
      }
    },

    formatNumber(value) {
      return value.toLocaleString("hu-HU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
  }
};
</script>

<style scoped>
.banner-container {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  font-family: inherit;
}

.green {
  color: green;
}

.banner-header {
  color: #0E0E23;
  display: block;
  padding: 1em;
  position: relative;
  border-bottom: 1px solid #f0f3f6;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.banner-body {
  padding: 1em;
  display: flex;
  justify-content: space-between;
}

.banner-left {
  flex: 1;
  padding: 0 1em;
}

.info-block {
  margin-bottom: 20px;
  line-height: 1.8em;
}

hr {
  margin: 20px 0;
  border: none;
  border-top: 1px solid #dee2e6;
}

.banner-right {
  flex: 1;
  text-align: center;
  padding: 0 1em;
}

.banner-right img {
  width: auto;
  height: auto;
}

.stats-box {
  background-color: #eeeeee;
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
}

.stat-item {
  display: flex;
  align-items: center;
}

.stat-item i {
  margin-right: 8px;
}

.stat-item p {
  margin: 0;
  color: #0e0e23;
}

.stat-item h5 {
  margin: 0;
  color: #0e0e23;
}

/* Visszaállított badge-dot színek */
.badge-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}

.bg-success {
  background-color: #198754; /* Zöld */
}

.bg-warning {
  background-color: #ffc107; /* Sárga */
}
</style>

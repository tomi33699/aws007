<template>
  <div class="engine-status-container">
    <div class="status-card">
      <h2><i class="fas fa-industry"></i> Gázmotor állapot</h2>
      <br><br><br>
      <div class="switches">
        <label>
          Minimális felszab (MW):
          <input type="number" v-model.number="minUpreg" />
        </label>
        <label>
          <input type="checkbox" v-model="checkPrevQuarterAlso" />
          Előző negyedórában is volt felszab
        </label>
      </div>

      <div class="engine-animation">
        <i v-if="shouldRun" class="fas fa-bolt fa-3x engine-on"></i>
        <i v-else class="fas fa-power-off fa-3x engine-off"></i>
        <p>{{ shouldRun ? 'Gázmotor működik' : 'Gázmotor leállítva' }}</p>
      </div>
    </div>

    <div class="data-card">
      <h3><i class="fas fa-chart-line"></i> Piaci adatok</h3>
      <ul>
        <li>Hazai felszab: <strong>{{ formatMw(lastAfrr?.hazai_fel) }}</strong></li>
        <li>Hazai leszab: <strong>{{ formatMw(lastAfrr?.hazai_le) }}</strong></li>
        <li>IGCC felszab: <strong>{{ formatMw(lastAfrr?.igcc_fel) }}</strong></li>
        <li>IGCC leszab: <strong>{{ formatMw(lastAfrr?.igcc_le) }}</strong></li>
        <li>Időpont: <strong>{{ lastAfrr?.time ?? 'N/A' }}</strong></li>
        <hr />
        <li>Felszab ár: <strong>{{ formatPrice(price?.up_price) }}</strong></li>
        <li>Leszab ár: <strong>{{ formatPrice(price?.down_price) }}</strong></li>
        <li>HUPX ár: <strong>{{ formatPrice(hupx) }}</strong></li>
        <li>Tény: <strong>{{ formatMw(lastVer?.teny) }}</strong></li>
        <li>Terv: <strong>{{ formatMw(lastVer?.terv) }}</strong></li>
        <li>Becslés: <strong>{{ formatMw(lastVer?.becsles) }}</strong></li>
        <li>Eltérés (Tény - Terv): <strong>{{ formatMw(delta) }}</strong></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { apiService } from '@/services/apiService';

const today = new Date().toISOString().split('T')[0];

const checkPrevQuarterAlso = ref(false);
const minUpreg = ref(30);

const last = ref<any>();
const prev = ref<any>();
const lastAfrr = ref<any>(null);
const price = ref<any>();
const hupx = ref<number>(0);
const lastVer = ref<any>();
const delta = ref<number>(0);

const shouldRun = computed(() => {
  const hazaiFelCurrent = last.value?.hazai_fel ?? 0;
  const hazaiFelPrev = prev.value?.hazai_fel ?? 0;
  const mfrrFel = last.value?.mfrr_fel ?? 0;

  const prevCondition = checkPrevQuarterAlso.value && hazaiFelPrev > 0;
  const minUpregCondition = hazaiFelCurrent >= minUpreg.value;
  const mfrrCondition = mfrrFel >= 100;

  return prevCondition || minUpregCondition || mfrrCondition;
});

onMounted(async () => {
  const afrrexport = await apiService.getAfrrexportData(today);
  const data = afrrexport.data;
  last.value = data.at(-1);
  prev.value = data.at(-2);

  const reversed = [...data].reverse();
  const nonZero = reversed.find(item =>
    item.hazai_fel !== 0 ||
    item.hazai_le !== 0 ||
    item.igcc_fel !== 0 ||
    item.igcc_le !== 0
  );

  if (nonZero) {
    lastAfrr.value = {
      time: new Date(nonZero.timestamp).toLocaleTimeString('hu-HU', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      hazai_fel: nonZero.hazai_fel,
      hazai_le: nonZero.hazai_le,
      igcc_fel: nonZero.igcc_fel,
      igcc_le: nonZero.igcc_le,
    };
  }

  // Mock mfrr_fel ha nincs
  if (last.value && !('mfrr_fel' in last.value)) {
    last.value.mfrr_fel = 0;
  }

  const priceResp = await apiService.getBalancingActivatedPrice(today);
  price.value = priceResp.lastData;

  const hupxResp = await apiService.getHUPXData(today);
  hupx.value = hupxResp.avg ?? 0;

  const verResp = await apiService.getVerexportData(today);
  const raw = verResp.data.map((d: any) => ({
    ...d,
    timestamp: new Date(d.timestamp),
    teny: d.brutto_teny,
    terv: d.brutto_terv ?? 0,
    becsles: d.brutto_dayahead ?? 0,
  }));
  lastVer.value = raw.at(-1);
  delta.value = (lastVer.value?.teny ?? 0) - (lastVer.value?.terv ?? 0);
});

const formatPrice = (val: number | null | undefined) => {
  if (val === null || val === undefined || isNaN(val)) return 'N/A';
  return `${Math.round(val).toLocaleString('hu-HU')} HUF/MWh`;
};

const formatMw = (val: number | null | undefined) => {
  if (val === null || val === undefined || isNaN(val)) return 'N/A';
  return `${Math.round(val).toLocaleString('hu-HU')} MW`;
};
</script>

<style scoped>
.engine-status-container {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  padding: 1rem 0;
}

.status-card,
.data-card {
  background: linear-gradient(145deg, #f9f9f9, #ffffff);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.07);
  flex: 1 1 380px;
  transition: transform 0.3s ease;
}

.status-card:hover,
.data-card:hover {
  transform: translateY(-4px);
}

.status-card {
  position: relative;
  background: url('@/assets/turbine.jpg') center/cover no-repeat;
  border-radius: 1rem;
  padding: 2rem;
  margin: 1rem;
  flex: 1 1 400px;
  min-height: 400px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.status-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(34, 46, 60, 0.95);
  z-index: 0;
  border-radius: 1rem;
}

.status-card > * {
  position: relative;
  z-index: 1;
}

h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #fff;
}

.switches {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
  font-size: 1rem;
  width: 100%;
  max-width: 300px;
}

.switches label {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
}

.engine-animation {
  text-align: center;
}

.engine-on,
.engine-off {
  font-size: 4rem;
}

.engine-on {
  color: #4caf50;
  animation: pulse 1.2s infinite ease-in-out;
}

.engine-off {
  color: #bbb;
  opacity: 0.8;
}

.engine-animation p {
  margin-top: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.6;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.data-card {
  background: #fff;
  border-radius: 1rem;
  padding: 2rem;
  flex: 1 1 400px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.data-card h3 {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.4rem;
  color: #212121;
  margin-bottom: 1rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 1rem;
  color: #333;
}

li strong {
  font-weight: 600;
  color: #212121;
}

h2, h3 {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
}

h2 i, h3 i {
  color: #3f51b5;
}

input {
  text-align: center;
  width: 15%;
}
</style>

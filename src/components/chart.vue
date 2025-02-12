<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { getBukkData, getHalmajData } from '@/services/apiService';
import { useDataStore } from '@/store/dataStore';
import VueApexCharts from 'vue3-apexcharts';
import DataCard from './dataCard.vue';

const ApexCharts = VueApexCharts;
const dataStore = useDataStore();
const selectedDate = ref(dataStore.selectedDate); // 🔹 Dátumot itt kezeljük reaktívan!

const bukkData = ref<any[]>([]);
const halmajData = ref<any[]>([]);
const sumPowerData = ref<any[]>([]);
const dailyBukkPower = ref<number>(0);
const dailyHalmajPower = ref<number>(0);
const dailySumPower = ref<number>(0);

// 🔹 Figyeljük a dátumváltozást és frissítjük az adatokat
watch(selectedDate, async (newDate) => {
  console.log("📅 Új dátum kiválasztva:", newDate);
  await fetchAllData();
});

// 🔹 15 perces időablakok alapján számítja a napi kWh értéket
const calculateDailyKwh = (data: any[]) => {
  if (!data || data.length === 0) return 0;

  const grouped = new Map<number, number[]>();

  data.forEach(item => {
    const timestamp = new Date(item.timestamp);
    const quarterHour = Math.floor(timestamp.getMinutes() / 15) * 15;
    const roundedTimestamp = new Date(timestamp);
    roundedTimestamp.setMinutes(quarterHour, 0, 0);

    const key = roundedTimestamp.getTime();
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)?.push(item.powerp);
  });

  let totalEnergy = 0;
  grouped.forEach(values => {
    const avgPower = values.reduce((a, b) => a + b, 0) / values.length;
    totalEnergy += avgPower * (15 / 60); // kWh-ra konvertálás (15 perc)
  });

  return safeParseFloat(totalEnergy);
};

// 🔹 Összes adat lekérése és feldolgozása
const fetchAllData = async () => {
  try {
    console.log("📡 Adatok lekérése a kiválasztott dátumra:", selectedDate.value);
    const bukkResponse = await getBukkData(selectedDate.value);
    const halmajResponse = await getHalmajData(selectedDate.value);

    console.log('Bükk adatok:', bukkResponse);
    console.log('Halmaj adatok:', halmajResponse);

    bukkData.value = bukkResponse.map((item: any) => ({
      powerp: parseFloat(item.powerp_kw || 0),
      irrad: parseFloat(item.irrad || 0),
      timestamp: new Date(item.timestamp || item.time).getTime()
    }));

    halmajData.value = halmajResponse.map((item: any) => ({
      powerp: parseFloat(item.powerp_kw || 0),
      irrad: parseFloat(item.irrad || 0),
      timestamp: new Date(item.timestamp || item.time).getTime()
    }));

    sumPowerData.value = bukkData.value.map((item, index) => ({
      timestamp: item.timestamp,
      powerp: item.powerp + (halmajData.value[index]?.powerp || 0)
    }));

    // ** 15 perces átlagolás után számolt napi teljesítmény **
    dailyBukkPower.value = calculateDailyKwh(bukkData.value);
    dailyHalmajPower.value = calculateDailyKwh(halmajData.value);
    dailySumPower.value = safeParseFloat(dailyBukkPower.value + dailyHalmajPower.value);

  } catch (error) {
    console.error('❌ Hiba az adatok lekérésekor:', error);
  }
};

onMounted(() => {
  fetchAllData();
});

// 🔹 NaN elkerülése
const safeParseFloat = (value: any) => {
  return typeof value === 'number' && !isNaN(value) ? parseFloat(value.toFixed(2)) : 0;
};

// 🔹 Legfrissebb adatok kiszámítása
const latestBukkPower = computed(() => safeParseFloat(bukkData.value.at(-1)?.powerp || 0));
const latestHalmajPower = computed(() => safeParseFloat(halmajData.value.at(-1)?.powerp || 0));
const latestBukkIrrad = computed(() => safeParseFloat(bukkData.value.at(-1)?.irrad || 0));
const latestHalmajIrrad = computed(() => safeParseFloat(halmajData.value.at(-1)?.irrad || 0));
const latestSumPower = computed(() => safeParseFloat(latestBukkPower.value + latestHalmajPower.value));
const latestTimestamp = computed(() => {
  const lastTimestamp = bukkData.value.at(-1)?.timestamp || halmajData.value.at(-1)?.timestamp || null;
  return lastTimestamp ? new Date(lastTimestamp).toLocaleString('hu-HU') : 'N/A';
});

// ** Chart beállítások **
const chartOptions = {
  chart: {
    id: 'power-irrad-chart',
    zoom: { enabled: false, type: 'x', autoScaleYaxis: true },
    toolbar: { tools: { zoom: true, reset: true } }
  },
  stroke: { width: 2 },
  xaxis: { type: 'datetime', labels: { format: 'HH:mm' } },
  yaxis: [
    { title: { text: 'Bükk Power (kW)' }, opposite: false },
    { title: { text: 'Halmaj Power (kW)' }, opposite: false },
    { title: { text: 'Irradiation' }, opposite: true }
  ],
  tooltip: { shared: true, x: { format: 'HH:mm' } }
};

const sumChartOptions = {
  chart: {
    id: 'sum-power-chart',
    zoom: { enabled: false, type: 'x', autoScaleYaxis: true },
    toolbar: { tools: { zoom: true, reset: true } }
  },
  stroke: { width: 2 },
  xaxis: { type: 'datetime', labels: { format: 'HH:mm' } },
  yaxis: { title: { text: 'Összesített Power (kW)' } },
  tooltip: { shared: true, x: { format: 'HH:mm' } }
};

// ** Adatok előkészítése a chartokhoz **
const preparePowerIrradData = () => [
  { name: 'Bükk Power', data: bukkData.value.map(item => ({ x: item.timestamp, y: safeParseFloat(item.powerp) })), yAxisIndex: 0, color: '#007bff' },
  { name: 'Halmaj Power', data: halmajData.value.map(item => ({ x: item.timestamp, y: safeParseFloat(item.powerp) })), yAxisIndex: 1, color: '#0056b3' },
  { name: 'Bükk Irradiation', data: bukkData.value.map(item => ({ x: item.timestamp, y: safeParseFloat(item.irrad) })), yAxisIndex: 2, color: '#f4c542', dashArray: 5 },
  { name: 'Halmaj Irradiation', data: halmajData.value.map(item => ({ x: item.timestamp, y: safeParseFloat(item.irrad) })), yAxisIndex: 2, color: '#e6a400', dashArray: 5 }
];

const prepareSumPowerData = () => [
  { name: 'Összesített Power', data: sumPowerData.value.map(item => ({ x: item.timestamp, y: safeParseFloat(item.powerp) })) }
];
</script>



<template>
  <div>
    <h1>Adat Vizualizáció</h1>

    <DataCard
      :latestHalmajPower="latestHalmajPower"
      :latestHalmajIrrad="latestHalmajIrrad"
      :latestBukkPower="latestBukkPower"
      :latestBukkIrrad="latestBukkIrrad"
      :latestSumPower="latestSumPower"
      :latestTimestamp="latestTimestamp"
      :dailyBukkPower="dailyBukkPower"
      :dailyHalmajPower="dailyHalmajPower"
      :dailySumPower="dailySumPower"
    />

    <label for="date-picker">Válassz dátumot:</label>
    <input id="date-picker" type="date" v-model="selectedDate" @change="fetchAllData" />

    <ApexCharts type="line" height="350" :options="sumChartOptions" :series="prepareSumPowerData()" />
    <ApexCharts type="line" height="350" :options="chartOptions" :series="preparePowerIrradData()" />
  </div>
</template>

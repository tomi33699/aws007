<template>
  <div>
    <VueApexCharts
      type="bar"
      :options="chartOptions"
      :series="series"
      height="400"
      ref="chartRef"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { apiService } from '@/services/apiService';

const chartRef = ref<any>(null);
const rawData = ref<{
  timestamp: string;
  hazai_fel: number;
  hazai_le: number;
  igcc_fel: number;
  igcc_le: number;
}[]>([]);

const date = new Date().toISOString().slice(0, 10);

onMounted(async () => {
  const response = await apiService.getAfrrexportData(date);
  rawData.value = response.data;
});

const categories = computed(() =>
  rawData.value.map(item =>
    new Date(item.timestamp).toLocaleTimeString('hu-HU', {
      hour: '2-digit',
      minute: '2-digit'
    })
  )
);

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '100%',
      borderRadius: 0
    }
  },
  stroke: {
    width: 1,
    colors: ['#14532d', '#14532d', '#eab308', '#eab308']
  },
  colors: ['#15803d', '#15803d', '#fde047', '#fde047'],
  dataLabels: {
    enabled: true,
    style: {
      colors: ['#000'],
      fontWeight: 'bold'
    },
    formatter: (val: number, opts: any) => {
      // Csak a hazai sorozatoknál jelenítjük meg (index 0, 1)
      return opts.seriesIndex < 2 && val !== 0 ? val.toFixed(2) : '';
    }
  },
  xaxis: {
    categories: categories.value,
    labels: {
      rotate: -45
    }
  },
  yaxis: {
    title: { text: 'Teljesítmény (MW)' }
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: (val: number) => `${val.toFixed(2)} MW`
    }
  },
  legend: {
    position: 'top'
  }
}));

const series = computed(() => [
  {
    name: 'Hazai aFRR FEL (15p)',
    data: rawData.value.map(item => item.hazai_fel)
  },
  {
    name: 'Hazai aFRR LE (15p)',
    data: rawData.value.map(item => -Math.abs(item.hazai_le))
  },
  {
    name: 'IGCC FEL (15p)',
    data: rawData.value.map(item => item.igcc_fel)
  },
  {
    name: 'IGCC LE (15p)',
    data: rawData.value.map(item => -Math.abs(item.igcc_le))
  }
]);
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>

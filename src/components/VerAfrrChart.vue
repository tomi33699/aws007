<template>
  <div>
    <!-- Kártyák: utolsó nem nulla értékek -->
    <div class="status-card">
      <div class="card-item">
        <div class="icon"><i class="fas fa-arrow-up"></i></div>
        <div class="title">Hazai fel</div>
        <div class="value">{{ last?.hazai_fel ?? 'N/A' }} MW</div>
      </div>
      <div class="card-item">
        <div class="icon"><i class="fas fa-arrow-down"></i></div>
        <div class="title">Hazai le</div>
        <div class="value">{{ last?.hazai_le ?? 'N/A' }} MW</div>
      </div>
      <div class="card-item">
        <div class="icon"><i class="fas fa-exchange-alt"></i></div>
        <div class="title">IGCC fel</div>
        <div class="value">{{ last?.igcc_fel ?? 'N/A' }} MW</div>
      </div>
      <div class="card-item">
        <div class="icon"><i class="fas fa-compress-arrows-alt"></i></div>
        <div class="title">IGCC le</div>
        <div class="value">{{ last?.igcc_le ?? 'N/A' }} MW</div>
      </div>
      <div class="card-item">
        <div class="icon"><i class="fas fa-clock"></i></div>
        <div class="title">Időpont</div>
        <div class="value">{{ last?.time ?? 'N/A' }}</div>
      </div>
    </div>

    <!-- Chart -->
    <VueApexCharts
      type="bar"
      :options="chartOptions"
      :series="series"
      :height="chartHeight"
      ref="chartRef"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { apiService } from '@/services/apiService';

const chartRef = ref<any>(null);
const chartHeight = computed(() => {
  return window.innerWidth <= 768 ? 600 : 800; // 📱 mobilon: 600, desktopon: 800
});


const rawData = ref<{
  timestamp: string;
  hazai_fel: number;
  hazai_le: number;
  igcc_fel: number;
  igcc_le: number;
}[]>([]);

const last = ref<{
  time: string;
  hazai_fel: number;
  hazai_le: number;
  igcc_fel: number;
  igcc_le: number;
} | null>(null);

const date = new Date().toISOString().slice(0, 10);

onMounted(async () => {
  const response = await apiService.getAfrrexportData(date);
  rawData.value = response.data;

  if (rawData.value.length) {
    const reversed = [...rawData.value].reverse();
    const nonZero = reversed.find(item =>
      item.hazai_fel !== 0 ||
      item.hazai_le !== 0 ||
      item.igcc_fel !== 0 ||
      item.igcc_le !== 0
    );

    if (nonZero) {
      last.value = {
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
  }
});

const categories = computed(() =>
  rawData.value.map(item =>
    new Date(item.timestamp).toLocaleTimeString('hu-HU', {
      hour: '2-digit',
      minute: '2-digit',
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
      return opts.seriesIndex < 2 && val !== 0 ? val.toFixed(2) : '';
    }
  },
  xaxis: {
    categories: categories.value,
    labels: {
      rotate: -45
    }
    ,
      tickAmount: 15, // 👉 kb. minden 9. felirat jelenik meg

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
.status-card {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  text-align: center;
}

.card-item {
  flex: 1 1 150px;
}

.icon {
  font-size: 1.5rem;
  margin-bottom: 0.3rem;
}

.title {
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.value {
  font-size: 1.1rem;
  font-weight: bold;
}
</style>

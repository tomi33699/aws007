export const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { type: 'linear' as const, position: 'left' },
      y1: { type: 'linear' as const, position: 'right', grid: { drawOnChartArea: false } }
    },
    elements: {
      line: { borderWidth: 2 },
      point: { radius: 3 }
    },
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true }
    }
  };
  
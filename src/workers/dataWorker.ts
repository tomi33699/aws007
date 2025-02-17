export interface DataItem {
  timestamp: string;
  power_kw: number;
  irrad?: number;
}

export interface WorkerInput {
  halmajData: DataItem[];
  bukkData: DataItem[];
  forecastData: { timestamp: string; today_1200_bukkabrany: number }[];
}

export interface WorkerOutput {
  totalData: DataItem[];
  interpolatedForecast: number[];
}

self.onmessage = (e: MessageEvent<WorkerInput>) => {
  const { halmajData, bukkData, forecastData } = e.data;

  const totalData: DataItem[] = halmajData.map((item, index) => ({
    timestamp: item.timestamp,
    power_kw: item.power_kw + (bukkData[index]?.power_kw ?? 0),
    irrad: (item.irrad ?? 0) + (bukkData[index]?.irrad ?? 0),
  }));

  const timestamps = totalData.map(item => new Date(item.timestamp).getTime());
  const originalForecast = forecastData.map(item => ({
    timestamp: new Date(item.timestamp).getTime(),
    value: item.today_1200_bukkabrany
  }));

  const interpolatedForecast = timestamps.map(time => {
    const before = originalForecast.filter(item => item.timestamp <= time).pop();
    const after = originalForecast.find(item => item.timestamp > time);

    if (!before) return after ? after.value : 0;
    if (!after) return before.value;

    const weight = (time - before.timestamp) / (after.timestamp - before.timestamp);
    return before.value + weight * (after.value - before.value);
  });

  const output = { totalData, interpolatedForecast } as WorkerOutput;
  self.postMessage(output);
};

export interface RealTimeData {
  plant: string;
  current_power_kw: number;
  current_irradiation: number;
  last_update: string;
}

export interface ProductionSummaryItem {
  plant: string;
  production_kwh: number;
}

// 🔹 A ProductionSummary típust itt definiáljuk tömbként
export type ProductionSummary = ProductionSummaryItem[];

export interface ForecastDataItem {
  timestamp: string;
  predicted_power: number;
  irradiation: number;
}

// 🔹 ForecastData típust tömbként definiáljuk
export type ForecastData = ForecastDataItem[];

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

interface PowerIrradData {
  powerp_kw?: number;
  irrad?: number;
  timestamp?: string;
  time?: string;
}

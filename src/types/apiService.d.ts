export interface ForecastData {
  timestamp: string;
  today_0000_halmajugra: number;
  today_0600_halmajugra: number;
  today_1200_halmajugra: number;
  today_1800_halmajugra: number;
  today_0000_bukkabrany: number;
  today_0600_bukkabrany: number;
  today_1200_bukkabrany: number;
  today_1800_bukkabrany: number;
}

export interface PowerData {
  timestamp: string;
  power_kw: number;
  irrad?: number; // Besugárzás érték (W/m²)
}

export interface BalancingPriceData {
  timestamp: string;
  up_price: number;
  down_price: number;
}


export interface BalancingVolumeData {
  timestamp: string;
  up_regulation: number;
  down_regulation: number;
}


export interface HUPXData {
  timestamp: string;
  price: number;
}

export interface PvRealTimeData {
  timestamp: string;
  plant: string;
  current_power_kw: number;
}


export interface PvProductionSummaryData {
  plant: string;
  production_kwh: number;
}

export interface AfrrData {
  szab_time: string;
  pmax: number;
  pelvi: number;
  pmin: number;
  szab_status: string;
}



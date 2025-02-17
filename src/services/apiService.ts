import axios from "axios";
import type {
  BalancingPriceData,
  BalancingVolumeData,
  ForecastData,
  HUPXData,
  PowerData,
  PvProductionSummaryData,
  PvRealTimeData,
} from "@/types/apiService";

const API_BASE_URL = "https://eforceapi.hu";

const cache = new Map();

async function memoizedApiCall(url: string, params: any) {
  const cacheKey = `${url}_${JSON.stringify(params)}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  const response = await axios.get(url, { params });
  cache.set(cacheKey, response.data);
  return response.data;
}


export const apiService = {
  

  async getPaginatedData(api: string, date: string, limit = 100, offset = 0) {
    const response = await axios.get(`${API_BASE_URL}/${api}`, { params: { date, limit, offset } });
    return response.data;
  },

  async getCachedData(api: string, date: string) {
    const cacheKey = `${api}_${date}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
    const response = await axios.get(`${API_BASE_URL}/${api}`, { params: { date } });
    sessionStorage.setItem(cacheKey, JSON.stringify(response.data));
    return response.data;
  },
  async getForecastData(date: string): Promise<{ data: ForecastData[]; lastData?: ForecastData }> {
    const response = await memoizedApiCall(`${API_BASE_URL}/forecast_data`, { date });
    const shiftedData = response.map((item: ForecastData) => ({
      ...item,
      timestamp: new Date(new Date(item.timestamp).getTime() + 1 * 60 * 60 * 1000).toISOString(),
    }));
    return { data: shiftedData, lastData: shiftedData.length > 0 ? shiftedData[shiftedData.length - 1] : undefined };
  },
  async getBalancingActivatedPrice(date: string): Promise<{ data: BalancingPriceData[]; lastData?: BalancingPriceData }> {
    const response = await axios.get(`${API_BASE_URL}/balancing_activated_price`, { params: { date } });
  
  
    // API válaszból adatok átalakítása
    const transformedData = response.data.map((item: any) => ({
      timestamp: item.date, // Az API válaszában "date" van, ezt használjuk timestampként
      up_price: item.up_price ?? 0, // Ha nincs érték, akkor 0
      down_price: item.down_price ?? 0 // Ha nincs érték, akkor 0
    }));
  
    return {
      data: transformedData,
      lastData: transformedData.length > 0 ? transformedData[transformedData.length - 1] : undefined
    };
  }
  ,

  async getBalancingActivatedVolume(
    date: string,
  ): Promise<{ data: BalancingVolumeData[]; lastData?: BalancingVolumeData }> {
    const response = await axios.get(
      `${API_BASE_URL}/balancing_activated_volume`,
      { params: { date } },
    );


    // Adatok átalakítása
    const transformedData = response.data.map((item: any) => ({
      timestamp: item.date, // API válaszában `date` van, nem `timestamp`
      up_regulation: item.up_regulation ?? 0,
      down_regulation: item.down_regulation ?? 0,
    }));

    return {
      data: transformedData,
      lastData: transformedData.length > 0
        ? transformedData[transformedData.length - 1]
        : undefined,
    };
  },
  async getHUPXData(date: string): Promise<{ data: HUPXData[]; avg?: number }> {
    const response = await axios.get(`${API_BASE_URL}/hupx_data`, {
      params: { date },
    });


    // Adatok átalakítása és 00:00-tól kezdő sorrendezés
    const transformedData: HUPXData[] = response.data
      .map((item: { date: string; hour: number; price: number }) => ({
        timestamp: `${item.date}T${
          String(item.hour - 1).padStart(2, "0")
        }:00:00`, // Órák 0-tól induljanak
        price: item.price ?? 0,
      }))
      .sort((a: HUPXData, b: HUPXData) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

    const avg = transformedData.length > 0
      ? transformedData.reduce(
        (sum: number, item: HUPXData) => sum + item.price,
        0,
      ) / transformedData.length
      : undefined;

    return { data: transformedData, avg };
  },
  async getBukk1MinData(date: string): Promise<{ data: PowerData[] }> {
    const response = await memoizedApiCall(`${API_BASE_URL}/bukk_1min_noregulation`, { date, limit: 100, offset: 0 });
    const transformedData = response.map(({ time, powerp_kw, irrad }: any) => ({
      timestamp: new Date(new Date(time).getTime() - 1 * 60 * 60 * 1000).toISOString(),
      power_kw: powerp_kw ?? 0,
      irrad: irrad ?? 0,
    }));
    return { data: transformedData };
  },

  async getHalmaj1MinData(date: string): Promise<{ data: PowerData[] }> {
    const response = await memoizedApiCall(`${API_BASE_URL}/halmaj_1min_noregulation`, { date, limit: 100, offset: 0 });
    const transformedData = response.map((item: any) => ({
      timestamp: new Date(new Date(item.time).getTime() - 1 * 60 * 60 * 1000).toISOString(),
      power_kw: item.powerp_kw ?? 0,
      irrad: item.irrad ?? 0,
    }));
    return { data: transformedData };
  },
  
  async getBukkDailyData(year: string, month: string): Promise<{ data: PowerData[] }> {
    const response = await axios.get(`${API_BASE_URL}/bukk_daily_data`, {
      params: { year, month },
    });


    const transformedData = response.data.map((item: any) => ({
      timestamp: item.date,
      power_kw: item.daily_powerp_kwh ?? 0,
    }));

    return { data: transformedData };
  },

  async getHalmajDailyData(year: string, month: string): Promise<{ data: PowerData[] }> {
    const response = await axios.get(`${API_BASE_URL}/halmaj_daily_data`, {
      params: { year, month },
    });
    const transformedData = response.data.map((item: any) => ({
      timestamp: item.date,
      power_kw: item.daily_powerp_kwh ?? 0,
    }));

    return { data: transformedData };
  },


  

  async getPvRealTimeData(): Promise<{ data: PvRealTimeData[]; lastData?: PvRealTimeData }> {
    const response = await axios.get(`${API_BASE_URL}/pv_real_time_data`);
  
  
    // Adatok átalakítása
    const transformedData = response.data.map((item: any) => ({
      timestamp: item.last_update, // Az API válaszából a "last_update" mezőt használjuk timestampként
      plant: item.plant, // Az erőmű neve
      current_power_kw: item.current_power_kw ?? 0 // Ha nincs adat, akkor 0
    }));
  
    return {
      data: transformedData,
      lastData: transformedData.length > 0 ? transformedData[transformedData.length - 1] : undefined
    };
  }
  ,

  async getPvProductionSummary(): Promise<
    { data: PvProductionSummaryData[]; lastData?: PvProductionSummaryData }
  > {
    const response = await axios.get(`${API_BASE_URL}/pv_production_summary`);
    return {
      data: response.data,
      lastData: response.data.length > 0
        ? response.data[response.data.length - 1]
        : undefined,
    };
  },
};

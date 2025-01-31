const API_BASE = "https://eforceapi.hu";

export async function fetchFromApi(endpoint: string, params?: Record<string, string>): Promise<any> {
  const query = params
    ? "?" + new URLSearchParams(params).toString()
    : "";
  const response = await fetch(`${API_BASE}${endpoint}${query}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return await response.json();
}

// Bükk adatok
export async function fetchBukkData(date: string): Promise<any[]> {
  if (!date) {
    throw new Error("[fetchBukkData] Missing date parameter.");
  }

  try {
    const response = await fetch(`https://eforceapi.hu/bukk_1min_unregulated?date=${date}`);
    if (!response.ok) {
      throw new Error(`[fetchBukkData] API request failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.warn("[fetchBukkData] The API response is not an array:", data);
      return [];
    }

    return data;
  } catch (error) {
    console.error("[fetchBukkData] Error occurred:", error);
    throw error;
  }
}


export async function fetchBukkRawData(date: string): Promise<any[]> {
  console.log(`[fetchBukkRawData] Fetching raw data for date: ${date}`);
  if (!date) {
    throw new Error("[fetchBukkRawData] Missing date parameter.");
  }

  try {
    const response = await fetch(`${API_BASE}/bukk_raw_data?date=${date}`);
    if (!response.ok) {
      throw new Error(`[fetchBukkRawData] API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("[fetchBukkRawData] API response:", data);

    if (!Array.isArray(data.data)) {
      console.warn("[fetchBukkRawData] The API response is not an array:", data);
      return [];
    }

    return data.data.map((item: { time?: string; powerp?: number; irrad?: number }) => ({
      time: item.time ? new Date(item.time).getTime() : Date.now(), // Ha nincs time, az aktuális időbélyeg kerül be
      powerp: item.powerp !== undefined ? parseFloat(item.powerp.toFixed(2)) : 0, // Ha nincs powerp, akkor 0
      irrad: item.irrad !== undefined ? parseFloat(item.irrad.toFixed(2)) : 0 // Ha nincs irrad, akkor 0
    }));
  } catch (error) {
    console.error("[fetchBukkRawData] Error occurred:", error);
    throw error;
  }
}




// Halmaj adatok
export async function fetchHalmajData(date: string): Promise<any> {
  if (!date) {
    throw new Error("A dátum kötelező a Halmaj adatok lekéréséhez.");
  }
  const response = await fetch(`https://eforceapi.hu/halmaj_1min_unregulated?date=${date}`);
  if (!response.ok) {
    throw new Error("Hiba történt a Halmaj adatok lekérésekor.");
  }
  return await response.json();
}

// HUPX adatok
export async function getHupxData(date?: string) {
  return await fetchFromApi("/hupx_data", date ? { date } : undefined);
}

// Balancing árak
export async function getBalancingPrices(date?: string) {
  return await fetchFromApi("/balancing_activated_price", date ? { date } : undefined);
}

// Balancing volumenek
export async function getBalancingVolumes(date?: string) {
  return await fetchFromApi("/balancing_activated_volume", date ? { date } : undefined);
}

// Napi tényleges terhelés
export async function getActualLoad(date?: string) {
  return await fetchFromApi("/actual_load", date ? { date } : undefined);
}

// Előrejelzett terhelés
export async function getForecastLoad(date?: string) {
  return await fetchFromApi("/forecast_load", date ? { date } : undefined);
}

// PV tényleges adatok
export async function getPvActualData(): Promise<any> {
  const response = await fetch("https://eforceapi.hu/pv_actual_data");
  if (!response.ok) {
    throw new Error("Nem sikerült lekérni a PV Actual Data adatokat az API-ról.");
  }
  return await response.json();
}
interface DataItem {
  bucket: string;
  real_powerp: number;
  avg_irrad: number;
  unregulated_powerp: number;
  unregulated_amount: number;
}

// Összesített adatok támogató metódusok
export async function fetchCombinedData(bukkDate: string, halmajDate: string): Promise<DataItem[]> {
  const [bukkData, halmajData]: [DataItem[], DataItem[]] = await Promise.all([
    fetchBukkData(bukkDate),
    fetchHalmajData(halmajDate),
  ]);

  // Az adatok szummázása
  const combinedData: DataItem[] = bukkData.map((bukkItem, index) => {
    const halmajItem = halmajData[index] || {} as DataItem;
    return {
      bucket: bukkItem.bucket,
      real_powerp: (bukkItem.real_powerp || 0) + (halmajItem.real_powerp || 0),
      avg_irrad: (bukkItem.avg_irrad || 0) + (halmajItem.avg_irrad || 0),
      unregulated_powerp: (bukkItem.unregulated_powerp || 0) + (halmajItem.unregulated_powerp || 0),
      unregulated_amount: (bukkItem.unregulated_amount || 0) + (halmajItem.unregulated_amount || 0),
    };
  });

  return combinedData;
}

// Bükk és Halmaj API adatokhoz egyszerűsített wrapper
export async function fetchChartData(type: "bukk" | "halmaj", date: string): Promise<DataItem[]> {
  if (type === "bukk") {
    return await fetchBukkData(date) as DataItem[];
  } else if (type === "halmaj") {
    return await fetchHalmajData(date) as DataItem[];
  } else {
    throw new Error("Ismeretlen típus a chart adatlekéréshez.");
  }
}

const API_BASE = "https://eforceapi.hu";
const cache = new Map<string, { data: any; expiry: number }>();

async function fetchFromApi(endpoint: string, params: Record<string, string> = {}, cacheDuration = 60000): Promise<any> {
  const query = Object.keys(params).length ? "?" + new URLSearchParams(params).toString() : "";
  const cacheKey = `${endpoint}-${JSON.stringify(params)}`;

  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }
  }
  const response = await fetch(`${API_BASE}${endpoint}${query}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();
  if (!data || typeof data !== 'object') {
    console.error(`[fetchFromApi] API response is invalid:`, data);
    return [];
  }

  if ('data' in data && Array.isArray(data.data)) {
    cache.set(cacheKey, { data: data.data, expiry: Date.now() + cacheDuration });
    return data.data;
  }

  if (Array.isArray(data)) {
    cache.set(cacheKey, { data, expiry: Date.now() + cacheDuration });
    return data;
  }

  console.error(`[fetchFromApi] Unexpected API response format:`, data);
  return [];
}

export async function fetchBukkData(date: string): Promise<any[]> {
  if (!date) throw new Error("[fetchBukkData] Missing date parameter.");
  return await fetchFromApi("/bukk_1min_unregulated", { date });
}

export async function fetchBukkRawData(date: string): Promise<any[]> {
  if (!date) throw new Error("[fetchBukkRawData] Missing date parameter.");
  return await fetchFromApi("/bukk_raw_data", { date });
}

export async function fetchHalmajData(date: string): Promise<any[]> {
  if (!date) throw new Error("A dátum kötelező a Halmaj adatok lekéréséhez.");
  return await fetchFromApi("/halmaj_1min_unregulated", { date });
}

export async function getPvActualData(): Promise<any> {
  return await fetchFromApi("/pv_actual_data");
}

export async function getHupxData(date?: string): Promise<any> {
  return await fetchFromApi("/hupx_data", date ? { date } : {});
}

export async function fetchBukkDailyData(): Promise<any[]> {
  return await fetchFromApi("/bukk_daily_data");
}

export async function fetchHalmajDailyData(): Promise<any[]> {
  return await fetchFromApi("/halmaj_daily_data");
}

const apiService = {
  fetchFromApi,
  fetchBukkData,
  fetchBukkRawData,
  fetchHalmajData,
  getPvActualData,
  getHupxData,
  fetchBukkDailyData,
  fetchHalmajDailyData,
};

export default apiService;
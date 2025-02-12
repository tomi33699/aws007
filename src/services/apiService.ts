import axios from 'axios';

const API_BASE_URL = 'https://eforceapi.hu';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 🔹 Böngésző-kompatibilis cache (helyettesíti a node-cache-t)
const cacheTTL = 300 * 1000; // 5 perc (ms)
const cacheStorage = new Map<string, { data: any, timestamp: number }>();

const fetchData = async (endpoint: string, params = {}) => {
    const cacheKey = `${endpoint}_${JSON.stringify(params)}`;
    const cachedData = cacheStorage.get(cacheKey);

    // 🔹 Ha van érvényes cache adat, használjuk
    if (cachedData && (Date.now() - cachedData.timestamp < cacheTTL)) {
        console.log(`📦 Cache-ből származó adat: ${endpoint}`, params);
        return cachedData.data;
    } else {
        console.log(`🌐 Friss API hívás: ${endpoint}`, params);
    }

    try {
        const response = await apiClient.get(endpoint, { params });
        cacheStorage.set(cacheKey, { data: response.data, timestamp: Date.now() });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.error(`API Error [${error.response.status}] at ${endpoint}:`, error.response.data.detail || error.response.data);
        } else if (error.request) {
            console.error(`API Error: No response received from ${endpoint}`, error.request);
        } else {
            console.error(`Unexpected API Error: ${error.message}`);
        }
        throw error;
    }
};

// API végpontok lekérése
export const getPVRealTimeData = async () => fetchData('/pv_real_time_data');
export const getPVProductionSummary = async (value: string) => fetchData('/pv_production_summary');
export const getForecastData = async (date: string) => fetchData('/forecast_data', { date });
export const getBukkData = async (date: string) => fetchData('/bukk_1min_noregulation', { date });
export const getHalmajData = async (date: string) => fetchData('/halmaj_1min_noregulation', { date });
export const getBalancingPrice = async (date: string) => fetchData('/balancing_activated_price', { date });
export const getBalancingVolume = async (date: string) => fetchData('/balancing_activated_volume', { date });
export const getHupxData = async (date: string) => fetchData('/hupx_data', { date });
export const getBukkDailyData = async (date: string) => fetchData('/bukk_daily_data', { date });
export const getHalmajDailyData = async (date: string) => fetchData('/halmaj_daily_data', { date });

export default apiClient;

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { 
    getPVRealTimeData, 
    getPVProductionSummary, 
    getForecastData, 
    getBukkData, 
    getHalmajData 
} from '@/services/apiService';
import type { RealTimeData, ProductionSummary, ForecastData } from '../types/apiService';
import wsService from '@/services/webSocketService';


export const useDataStore = defineStore('dataStore', () => {
    // 🔹 Állapotváltozók
    const productionSummary = ref<ProductionSummary>([]);
    const forecastData = ref<ForecastData>([]);
    const bukkData = ref<any[]>([]);
    const halmajData = ref<any[]>([]);
    const selectedDate = ref(new Date().toISOString().slice(0, 10)); // Hozzáadva a store-hoz

    const realTimeData = ref<RealTimeData[]>([]);
    const halmajPowerNoreg = ref<any[]>([]);
    const halmajIrradNoreg = ref<any[]>([]);
    const sumPower = ref<any[]>([]);
    const sumIrrad = ref<any[]>([]);

    // 🔹 WebSocket adatfrissítés közvetlenül
    const updateRealTimeData = (newData: { table: string; powerp_kw: number; timestamp: string, powerp_unregulated?: number, irrad?: number }) => {
        const plantName = newData.table.includes("bukk") ? "BUKK" : "HALMAJ";
        const formattedTimestamp = new Date(newData.timestamp).toLocaleString("hu-HU");

        const index = realTimeData.value.findIndex(item => item.plant === plantName);
        if (index !== -1) {
            realTimeData.value[index].current_power_kw = newData.powerp_kw;
            realTimeData.value[index].last_update = formattedTimestamp;
        } else {
            realTimeData.value.push({
                plant: plantName,
                current_power_kw: newData.powerp_kw,
                current_irradiation: newData.irrad || 0,
                last_update: formattedTimestamp
            });
        }

        if (newData.table.includes("halmaj_1min_noregulation")) {
            halmajPowerNoreg.value.push({ x: new Date(newData.timestamp).getTime(), y: newData.powerp_unregulated || 0 });
            halmajIrradNoreg.value.push({ x: new Date(newData.timestamp).getTime(), y: newData.irrad || 0 });
        }

        const totalPower = realTimeData.value.reduce((sum, plant) => sum + plant.current_power_kw, 0);
        const totalIrrad = halmajIrradNoreg.value.reduce((sum, item) => sum + item.y, 0);

        sumPower.value.push({ x: new Date(newData.timestamp).getTime(), y: totalPower });
        sumIrrad.value.push({ x: new Date(newData.timestamp).getTime(), y: totalIrrad });

        console.log("⚡ Real-time adat frissítve:", realTimeData.value);
    };

    // 🔹 API Lekérés
    const fetchRealTimeData = async () => {
        try {
            const data = await getPVRealTimeData();
            realTimeData.value = data;
        } catch (error) {
            console.error('Error fetching real-time data:', error);
        }
    };
    const fetchProductionSummary = async (date: string) => {
        try {
            const data = await getPVProductionSummary(date); // Átadjuk a dátumot
            productionSummary.value = data;
        } catch (error) {
            console.error('Error fetching PV production summary:', error);
        }
    };
    
    
        

    const fetchForecastData = async () => {
        try {
            const data = await getForecastData('2025-02-12');  // Dátum példa
            forecastData.value = data;
        } catch (error) {
            console.error('Error fetching forecast data:', error);
        }
    };

    // 🔹 Formázott adatok
    const formattedProductionSummary = computed(() => {
        return productionSummary.value.map(item => ({
            label: item.plant.toUpperCase(),
            value: item.production_kwh || 0,
        }));
    });

    const formattedRealTimeData = computed(() => {
        return realTimeData.value.map(item => ({
            label: item.plant.toUpperCase(),
            value: item.current_power_kw || 0,
            last_update: item.last_update || "N/A"
        }));
    });

    const totalCurrentPower = computed(() => {
        return realTimeData.value.reduce((sum, plant) => sum + (plant.current_power_kw || 0), 0);
    });

    // 🔹 WebSocket inicializálás
    wsService.on('new_data', updateRealTimeData);

    return {
        realTimeData,
        updateRealTimeData,
        productionSummary,
        forecastData,
        bukkData,
        halmajData,
        halmajPowerNoreg,
        halmajIrradNoreg,
        sumPower,
        sumIrrad,
        fetchRealTimeData,
        fetchProductionSummary,
        fetchForecastData,
        formattedProductionSummary,
        formattedRealTimeData,
        totalCurrentPower,
        selectedDate 
    };
});

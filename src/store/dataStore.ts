import { reactive } from "vue";
import { getPvActualData, fetchBukkData } from "../services/apiService";

interface BukkDataItem {
  x: number;
  real_powerp: number;
  avg_irrad: number;
}

const state = reactive({
  actualData: {},
  bukkData: [] as BukkDataItem[], // Bükk chart adatok típusdefinícióval
  lastUpdated: null as string | null,
  isLoading: false,
});

export function useDataStore() {
  return {
    state,

    async fetchActualData() {
      state.isLoading = true;
      try {
        state.actualData = await getPvActualData();
      } catch (error) {
        console.error("Error fetching actual data:", error);
      } finally {
        state.isLoading = false;
      }
    },

    async fetchBukkData(date: string) {
      state.isLoading = true;
      try {
        const response = await fetchBukkData(date);
        state.bukkData = response.map((item) => ({
          x: new Date(item.bucket).getTime(),
          real_powerp: item.real_powerp,
          avg_irrad: item.avg_irrad,
        }));
        state.lastUpdated = new Date().toISOString();
      } catch (error) {
        console.error("Error fetching Bükk data:", error);
      } finally {
        state.isLoading = false;
      }
    },

    updateBukkData(newData: { real_powerp: number; avg_irrad: number }) {
      state.bukkData.push({
        x: Date.now(),
        real_powerp: newData.real_powerp,
        avg_irrad: newData.avg_irrad,
      });
      state.lastUpdated = new Date().toISOString();
    },
  };
}

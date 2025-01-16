import { reactive } from 'vue';
import { getPvActualData  } from '../services/apiService';

const state = reactive({
  actualData: {},
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
        console.error(error);
      } finally {
        state.isLoading = false;
      }
    },
  };
}

import { create } from 'zustand';
import { AnalyticsData, generateAnalytics } from '../utils/analytics';

interface AnalyticsState {
  data: AnalyticsData | null;
  isLoading: boolean;
  fetchAnalytics: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  data: null,
  isLoading: false,
  
  fetchAnalytics: () => {
    set({ isLoading: true });
    
    try {
      const analyticsData = generateAnalytics();
      set({ data: analyticsData, isLoading: false });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      set({ isLoading: false });
    }
  },
}));
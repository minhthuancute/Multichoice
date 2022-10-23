import create from 'zustand';

export interface ILoadingRealtimeStore {
  isLoadingRealtime: boolean;
  setLoadingRealtime: (isLoading: boolean) => void;
}

export const loadingRealtimeStore = create<ILoadingRealtimeStore>()((set) => ({
  isLoadingRealtime: true,
  setLoadingRealtime: (isLoading) =>
    set(() => {
      return {
        isLoadingRealtime: isLoading,
      };
    }),
}));

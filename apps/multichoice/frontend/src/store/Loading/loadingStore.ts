import create from 'zustand';

export interface ILoadingStore {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

export const loadingStore = create<ILoadingStore>()((set) => ({
  isLoading: false,
  setLoading: (isLoading = false) =>
    set(() => {
      return {
        isLoading,
      };
    }),
}));

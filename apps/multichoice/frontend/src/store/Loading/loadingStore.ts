import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface ILoadingStore {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

export const loadingStore = create<ILoadingStore>()(
  devtools(
    persist(
      (set) => ({
        isLoading: false,
        setLoading: (isLoading = false) =>
          set(() => {
            return {
              isLoading,
            };
          }),
      }),
      {
        name: 'loading',
      }
    )
  )
);

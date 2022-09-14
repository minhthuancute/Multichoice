import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { LOADING } from '../../constants/contstants';

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
        name: LOADING,
      }
    )
  )
);

import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { USER_DO_EXAM } from '../../constants/contstants';

export interface IUserExamStore {
  userID: number | null;
  userName: string;
  setUserID: (userID: number) => void;
  setUserName: (userName: string) => void;
}

export const userExamStore = create<IUserExamStore>()(
  devtools(
    persist(
      (set) => ({
        userID: null,
        userName: '',
        setUserID: (userID: number) =>
          set(() => {
            return {
              userID,
            };
          }),
        setUserName: (userName: string) =>
          set(() => {
            return {
              userName,
            };
          }),
      }),
      {
        name: USER_DO_EXAM,
        getStorage: () => sessionStorage,
      }
    )
  )
);

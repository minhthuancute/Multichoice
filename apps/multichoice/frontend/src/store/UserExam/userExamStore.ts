import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { USER_DO_EXAM } from '../../constants/contstants';

export interface IUserExamStore {
  userID: number | null;
  username: string;
  setUserID: (userID: number) => void;
  setUserName: (username: string) => void;
}

export const userExamStore = create<IUserExamStore>()(
  devtools(
    persist(
      (set) => ({
        userID: null,
        username: '',
        setUserID: (userID: number) =>
          set(() => {
            return {
              userID,
            };
          }),
        setUserName: (username: string) =>
          set(() => {
            return {
              username,
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

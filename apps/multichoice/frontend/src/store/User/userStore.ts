import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AuthPayload } from '../../types/LoginResponse';

export interface IDataUser extends AuthPayload {
  token: string;
}
export interface IUserStore {
  user: IDataUser;
  setInforUser: (data: AuthPayload, token: string) => void;
}

export const userStore = create<IUserStore>()(
  devtools(
    persist(
      (set) => ({
        user: {} as IDataUser,
        setInforUser: (data: AuthPayload, token: string) =>
          set(() => {
            return {
              user: {
                ...data,
                token,
              },
            };
          }),
      }),
      {
        name: 'user',
      }
    )
  )
);

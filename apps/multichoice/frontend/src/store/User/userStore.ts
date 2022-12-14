import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CURRENT_USER } from '../../constants/contstants';
import { AuthPayload } from '../../pages/Login/Login';
import { authenServices } from '../../services/Authen/AuthenServices';

export interface IDataUser extends AuthPayload {
  token: string;
}
export interface IUserStore {
  user: IDataUser;
  isAuthenticated: boolean;
  setInforUser: (data: AuthPayload, token: string) => void;
  checkAuthenticated: () => Promise<void>;
  setAuthenticated: (isAuthen: boolean) => void;
}

export const userStore = create<IUserStore>()(
  devtools(
    persist(
      (set) => ({
        user: {} as IDataUser,
        isAuthenticated: false,
        setInforUser: (data: AuthPayload, token: string) =>
          set(() => {
            return {
              user: {
                ...data,
                token,
              },
            };
          }),

        checkAuthenticated: async () => {
          try {
            await authenServices.token();
            set({
              isAuthenticated: true,
            });
          } catch {
            set({
              isAuthenticated: false,
              user: {} as IDataUser,
            });
          }
        },

        setAuthenticated: (isAuthen: boolean) => {
          set({
            isAuthenticated: isAuthen,
          });
        },
      }),
      {
        name: CURRENT_USER,
      }
    )
  )
);

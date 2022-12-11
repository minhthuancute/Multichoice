import jwtDecode from 'jwt-decode';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CURRENT_USER, TOKEN } from '../../constants/contstants';
import { AuthPayload } from '../../pages/Login/Login';
import { localServices } from '../../services/Applications/LocalServices';
import { ITokenPayload } from '../../types/Topic';

export interface IDataUser extends AuthPayload {
  token: string;
}
export interface IUserStore {
  user: IDataUser;
  setInforUser: (data: AuthPayload, token: string) => void;
  isAuthenticated: () => boolean;
}

export const userStore = create<IUserStore>()(
  devtools(
    persist(
      (set, get) => ({
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

        isAuthenticated: () => {
          try {
            const token = localServices.getData(TOKEN) || '';
            const decodeToken = jwtDecode(token) as ITokenPayload;
            const isExpried = decodeToken.exp > Date.now() / 1000;
            return isExpried;
          } catch (error) {
            return false;
          }
        },
      }),
      {
        name: CURRENT_USER,
      }
    )
  )
);

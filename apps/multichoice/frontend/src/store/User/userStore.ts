import create from 'zustand';
import { devtools, redux, persist } from 'zustand/middleware';
import { AuthPayload } from '../../types/LoginResponse';
import { IUserActions } from './userTypes';
import { userReducer } from './userReducer';

export interface IDataUser extends AuthPayload {
  token: string;
}

export interface IUserStore {
  user: IDataUser;
  // setInforUser: (data: AuthPayload, token: string) => void;
  dispatch: (args: IUserActions) => void;
}

const initialState: IUserStore = {} as IUserStore;

// export const userStore = create<IUserStore>()(
//   devtools(
//     persist(
//       (set) => ({
//         user: {} as IDataUser,

//         dispatch: (args) => set((state) => userReducer(state, args)),
//         // setInforUser: (data: AuthPayload, token: string) =>
//         //   set(() => {
//         //     return {
//         //       user: {
//         //         ...data,
//         //         token,
//         //       },
//         //     };
//         //   }),
//       }),
//       {
//         name: 'user',
//       }
//     )
//   )
// );

export const userStore = create<IUserStore>()(
  devtools(
    persist(
      (set) => ({
        user: {} as IDataUser,

        dispatch: (args) => set((state) => userReducer(state, args)),
        // setInforUser: (data: AuthPayload, token: string) =>
        //   set(() => {
        //     return {
        //       user: {
        //         ...data,
        //         token,
        //       },
        //     };
        //   }),
      }),
      {
        name: 'user',
      }
    )
  )
);

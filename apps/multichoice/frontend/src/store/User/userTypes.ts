import { IDataUser } from './userStore';

export enum UserActionsEnum {
  SET_DATA = 'SET_DATA',
  DEMO = 'DEMO',
}

type Actions = UserActionsEnum.SET_DATA | UserActionsEnum.DEMO;

export interface IUserActions {
  type: string;
  userPayload: IDataUser;
}

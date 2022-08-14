import { IUserActions, UserActionsEnum } from './userTypes';
import { IUserStore } from './userStore';

export const userReducer = (
  state: IUserStore,
  { type, userPayload }: IUserActions
): IUserStore => {
  switch (type) {
    case UserActionsEnum.SET_DATA:
      return {
        ...state,
        user: userPayload ? userPayload : state.user,
      };

    case 'DEMO':
      return {
        ...state,
        user: userPayload,
      };

    default:
      return state;
  }
};

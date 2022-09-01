import { IBaseResponse } from './BaseRespone';

export interface AuthPayload {
  id: number;
  username: string;
  email: string;
}

export interface ILoginResponse extends IBaseResponse {
  data: {
    token: string;
    payload: AuthPayload;
  };
}

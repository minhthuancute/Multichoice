import { IAxiosResponse } from './AxiosRespone';

export interface AuthPayload {
  id: number;
  username: string;
  email: string;
}

export interface ILoginResponse extends IAxiosResponse {
  data: {
    token: string;
    payload: AuthPayload;
  };
}

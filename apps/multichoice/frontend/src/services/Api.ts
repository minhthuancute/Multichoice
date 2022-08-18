import axios, { AxiosInstance } from 'axios';
import { TOKEN } from '../constants/contstants';
import { localServices } from './LocalServices';

export class Api {
  axiosInstance: AxiosInstance;
  constructor() {
    const token = localServices.getData(TOKEN);
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:3333/api',
    });
    this.axiosInstance.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${token}`;
  }

  get(url: string) {
    return this.axiosInstance.get(url);
  }

  post(url: string, body?: any) {
    return this.axiosInstance.post(url, body);
  }
}

const apiClient = new Api();

export default apiClient;

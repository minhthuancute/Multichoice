import axios, { AxiosInstance } from 'axios';
import { environment } from '../environments/environment';

export class Api {
  axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:3333/api',
    });
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

import axios, { AxiosInstance } from 'axios';
import { environment } from '../environments/environment';

export class Api {
  axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:3333/api',
    });
  }

  async get(url: string) {
    const { data } = await this.axiosInstance.get(url);
    return data;
  }

  async post(url: string, body?: any) {
    const { data } = await this.axiosInstance.post(url, body);
    return data;
  }
}

const apiClient = new Api();

export default apiClient;

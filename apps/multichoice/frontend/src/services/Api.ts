import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { TOKEN } from '../constants/contstants';
import { localServices } from './LocalServices';

export class Api {
  axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:3333/api',
    });

    this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const token = localServices.getData(TOKEN);
        config!.headers!['Authorization'] = `Bearer ${token}`;
        return config;
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  get(url: string) {
    return this.axiosInstance.get(url);
  }

  post(url: string, body?: any) {
    return this.axiosInstance.post(url, body);
  }

  delete(url: string, body?: any) {
    return this.axiosInstance.delete(url, body);
  }
}

const apiClient = new Api();

export default apiClient;

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { TOKEN } from '../constants/contstants';
import { localServices } from './LocalServices';

export class Api {
  axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://detracnghiem.vn/api',
    });

    this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig): AxiosRequestConfig => {
        const token = localServices.getData(TOKEN);

        config!.headers!['Authorization'] = `Bearer ${token}`;
        return config;
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse => {
        return response;
      },
      (err: AxiosError): Promise<AxiosError> => {
        console.log(err);
        return Promise.reject(err);
      }
    );
  }

  get(url: string) {
    return this.axiosInstance.get(url);
  }

  post(url: string, body?: any) {
    return this.axiosInstance.post(url, body);
  }

  update(url: string, body?: any) {
    return this.axiosInstance.patch(url, body);
  }

  delete(url: string, body?: any) {
    return this.axiosInstance.delete(url, body);
  }
}

const apiClient = new Api();

export default apiClient;

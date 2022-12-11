import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { TOKEN } from '../constants/contstants';
import { localServices } from './Applications/LocalServices';
import { loadingStore } from '../store/rootReducer';

let pendingRequest = 0;

const axiosClient: AxiosInstance = axios.create({
  baseURL:
    process.env['NODE_ENV'] === 'production'
      ? 'https://detracnghiem.vn/api'
      : 'http://localhost:3333/api',
});

axiosClient.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    // pendingRequest += 1;
    // const state = loadingStore.getState();
    // state.setLoading(true);
    const token = localServices.getData(TOKEN);
    config!.headers!['Authorization'] = `Bearer ${token}`;
    return config;
  }
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // this.clearLoading();
    return response;
  },
  async (err: AxiosError): Promise<AxiosError> => {
    // this.clearLoading();
    // await this.sleep(500);
    return Promise.reject(err);
  }
);

export const sleep = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

export const clearLoading = () => {
  pendingRequest -= 1;
  if (pendingRequest === 0) {
    const state = loadingStore.getState();
    setTimeout(() => {
      // state.setLoading(false);
    }, 500);
  }
};

export { axiosClient };

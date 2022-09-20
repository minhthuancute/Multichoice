import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { TOKEN } from '../constants/contstants';
import { localServices } from './LocalServices';
import { useState } from 'react';
import { loadingStore } from '../store/rootReducer';
import { useStore } from 'zustand';

let pendingRequest: number = 0;

export class Api {
  axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL:
        process.env['NODE_ENV'] === 'production'
          ? 'https://detracnghiem.vn/api'
          : 'http://localhost:3333/api',
    });

    this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig): AxiosRequestConfig => {
        pendingRequest += 1;
        const state = loadingStore.getState();
        state.setLoading(true);
        const token = localServices.getData(TOKEN);
        config!.headers!['Authorization'] = `Bearer ${token}`;
        return config;
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse => {
        this.clearLoading();
        console.log('pendingRequest', pendingRequest);

        return response;
      },
      async (err: AxiosError): Promise<AxiosError> => {
        this.clearLoading();
        await this.sleep(500);
        return Promise.reject(err);
      }
    );
  }

  sleep(time: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }

  clearLoading() {
    pendingRequest -= 1;
    if (pendingRequest === 0) {
      const state = loadingStore.getState();
      setTimeout(() => {
        state.setLoading(false);
      }, 500);
    }
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

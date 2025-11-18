import axios from 'axios';
import { storage } from '@/utils/storage';

type TokenProvider = () => Promise<string | null> | string | null;

let tokenProvider: TokenProvider | null = null;

export const setApiTokenProvider = (provider: TokenProvider) => {
  tokenProvider = provider;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    config.headers = config.headers ?? {};
    let token = storage.getToken();

    if (tokenProvider) {
      try {
        const providerToken = await tokenProvider();
        if (providerToken) {
          token = providerToken;
          storage.setToken(providerToken);
        }
      } catch (error) {
        console.warn('Failed to retrieve token from provider:', error);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle logout or redirect
    }
    return Promise.reject(error);
  }
);

export default api;

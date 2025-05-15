import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getToken } from './auth';

// Define base URLs for each service
const BASE_URLS = {
  auth: 'http://localhost:8081',
  story: 'http://localhost:8082',
  message: 'http://localhost:8083'
};

// Create axios instances for each service
const createApiInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor for auth headers
  instance.interceptors.request.use(
    async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        // Could redirect to login or refresh token
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Export API instances
export const authApi = createApiInstance(BASE_URLS.auth);
export const storyApi = createApiInstance(BASE_URLS.story);
export const messageApi = createApiInstance(BASE_URLS.message);

// Generic API request function
export const apiRequest = async <T>(
  api: typeof authApi | typeof storyApi | typeof messageApi,
  config: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api(config);
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
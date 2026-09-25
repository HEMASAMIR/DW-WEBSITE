import axios from 'axios';
import { API_BASE_URL } from '@/constants/apiRoutes';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT token if logged in
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('dw_token') || sessionStorage.getItem('dw_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global error logging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional Token Expiration handling
      if (typeof window !== 'undefined') {
        // localStorage.removeItem('dw_token');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

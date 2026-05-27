import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://community-discussion-platform.onrender.com/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request: attach access token ──────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response: auto-refresh on 401 ────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as typeof error.config & { _retry?: boolean };

    // Only handle 401s that haven't already been retried
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // If another refresh is already in-flight, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(original);
        })
        .catch((err) => Promise.reject(err));
    }

    original._retry = true;
    isRefreshing = true;

    const refreshToken = typeof window !== 'undefined'
      ? localStorage.getItem('refreshToken')
      : null;

    if (!refreshToken) {
      isRefreshing = false;
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    try {
      // Use plain axios so this call bypasses our interceptor
      const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
      const newAccessToken: string = res.data.accessToken;

      localStorage.setItem('token', newAccessToken);
      processQueue(null, newAccessToken);

      original.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

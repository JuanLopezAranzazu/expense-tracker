import axios from 'axios';

export const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';
export const TOKEN_KEY = 'expense_tracker_token';
export const LOGOUT_EVENT = 'auth:logout';

const BACKEND_USES_SNAKE_CASE = true;

const toSnake = (s: string) => s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
const toCamel = (s: string) => s.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());

function mapKeys(value: unknown, fn: (key: string) => string): unknown {
  if (Array.isArray(value)) return value.map((v) => mapKeys(v, fn));
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [fn(k), mapKeys(v, fn)]),
    );
  }
  return value;
}

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (BACKEND_USES_SNAKE_CASE && config.data && typeof config.data === 'object') {
    config.data = mapKeys(config.data, toSnake);
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (BACKEND_USES_SNAKE_CASE) response.data = mapKeys(response.data, toCamel);
    return response;
  },
  (error) => {
    const url: string = error.config?.url ?? '';
    const isAuthCall = url.includes('/auth/');
    if (error.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event(LOGOUT_EVENT));
    }
    return Promise.reject(error);
  },
);

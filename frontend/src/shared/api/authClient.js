import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore.js';

const authClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  timeout: 10000,
});

authClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerRequest = (data) => authClient.post('/auth/register', data);
export const loginRequest = (data) => authClient.post('/auth/login', data);

export default authClient;
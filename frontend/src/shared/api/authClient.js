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

// Mapear español → inglés para registro
const toRegisterBackend = (data) => ({
  FirstName: data.nombre,
  LastName: data.apellido,
  Phone: data.telefono,
  Email: data.email,
  Password: data.password,
});

export const registerRequest = (data) => authClient.post('/auth/register', toRegisterBackend(data));

export const loginRequest = (data) => authClient.post('/auth/login', {
  Email: data.email,
  Password: data.password,
});

export default authClient;

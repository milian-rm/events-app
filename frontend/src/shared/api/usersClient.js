import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore.js';

const usersClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  timeout: 10000,
});

usersClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getUsers = (params) => usersClient.get('/auth/users', { params });
export const createUser = (data) => usersClient.post('/auth/users', data);
export const updateUser = (id, data) => usersClient.put(`/auth/users/${id}`, data);
export const deleteUser = (id) => usersClient.delete(`/auth/users/${id}`);

export default usersClient;
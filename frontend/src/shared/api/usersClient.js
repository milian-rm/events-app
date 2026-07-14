import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore.js';

const usersClient = axios.create({
  baseURL: import.meta.env.VITE_EVENTS_URL,
  timeout: 10000,
});

usersClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Mapear español → inglés antes de enviar al backend
const toBackend = (data) => {
  if (!data || typeof data !== 'object') return data;
  const out = { ...data };
  // Combinar nombre + apellido → fullName
  if (out.nombre || out.apellido) {
    out.fullName = `${out.nombre || ''} ${out.apellido || ''}`.trim();
    delete out.nombre;
    delete out.apellido;
  }
  // telefono → phone
  if (out.telefono !== undefined) {
    out.phone = out.telefono;
    delete out.telefono;
  }
  return out;
};

// Mapear inglés → español al recibir del backend
const fromBackend = (item) => {
  if (!item || typeof item !== 'object') return item;
  const fullName = item.fullName || '';
  const parts = fullName.split(' ');
  return {
    ...item,
    nombre: parts[0] || item.nombre || '',
    apellido: parts.slice(1).join(' ') || item.apellido || '',
    telefono: item.phone || item.telefono || '',
  };
};

const mapResponse = (res) => {
  if (res.data?.data && Array.isArray(res.data.data)) {
    res.data.data = res.data.data.map(fromBackend);
  } else if (res.data?.data && typeof res.data.data === 'object') {
    res.data.data = fromBackend(res.data.data);
  }
  return res;
};

export const getUsers = (params) => usersClient.get('/users', { params }).then(mapResponse);
export const getUserById = (id) => usersClient.get(`/users/${id}`).then(mapResponse);
export const createUser = (data) => usersClient.post('/users', toBackend(data)).then(mapResponse);
export const updateUser = (id, data) => usersClient.put(`/users/${id}`, toBackend(data)).then(mapResponse);
export const deleteUser = (id) => usersClient.delete(`/users/${id}`);

export default usersClient;

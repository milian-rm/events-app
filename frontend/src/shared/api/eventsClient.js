import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore.js';

const eventsClient = axios.create({
  baseURL: import.meta.env.VITE_EVENTS_URL,
  timeout: 10000,
});

eventsClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Mapear español → inglés antes de enviar al backend
const toBackend = (data) => {
  if (!data || typeof data !== 'object') return data;
  const map = { nombre: 'eventName', fecha: 'date', lugar: 'location', capacidad: 'capacity' };
  const out = {};
  for (const [k, v] of Object.entries(data)) {
    out[map[k] || k] = v;
  }
  return out;
};

// Mapear inglés → español al recibir del backend
const fromBackend = (item) => {
  if (!item || typeof item !== 'object') return item;
  return {
    ...item,
    nombre: item.eventName || item.nombre || '',
    fecha: item.date || item.fecha || '',
    lugar: item.location || item.lugar || '',
    capacidad: item.capacity ?? item.capacidad ?? 0,
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

export const getEvents = (params) => eventsClient.get('/events', { params }).then(mapResponse);
export const getEventById = (id) => eventsClient.get(`/events/${id}`).then(mapResponse);
export const createEvent = (data) => eventsClient.post('/events', toBackend(data)).then(mapResponse);
export const updateEvent = (id, data) => eventsClient.put(`/events/${id}`, toBackend(data)).then(mapResponse);
export const deleteEvent = (id) => eventsClient.delete(`/events/${id}`);

export default eventsClient;

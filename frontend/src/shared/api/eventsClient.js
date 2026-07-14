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

export const getEvents = (params) => eventsClient.get('/events', { params });
export const getEventById = (id) => eventsClient.get(`/events/${id}`);
export const createEvent = (data) => eventsClient.post('/events', data);
export const updateEvent = (id, data) => eventsClient.put(`/events/${id}`, data);
export const deleteEvent = (id) => eventsClient.delete(`/events/${id}`);

export default eventsClient;
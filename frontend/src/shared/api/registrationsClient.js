import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore.js';

const registrationsClient = axios.create({
  baseURL: import.meta.env.VITE_REGISTRATIONS_URL,
  timeout: 10000,
});

registrationsClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getAvailableEvents = () => registrationsClient.get('/events/available');
export const getFullEvents = () => registrationsClient.get('/events/full');
export const getSummary = () => registrationsClient.get('/summary');
export const getAttendees = (eventId) => registrationsClient.get(`/events/${eventId}/attendees`);
export const createRegistration = (data) => registrationsClient.post('/registrations', data);
export const cancelRegistrationRequest = (id) => registrationsClient.delete(`/registrations/${id}`);

export default registrationsClient;
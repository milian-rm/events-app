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

// Mapear español → inglés antes de enviar al backend
const toBackend = (data) => {
  if (!data || typeof data !== 'object') return data;
  const out = { ...data };
  if (out.nombreAsistente !== undefined) {
    out.attendeeName = out.nombreAsistente;
    delete out.nombreAsistente;
  }
  if (out.correoAsistente !== undefined) {
    out.attendeeEmail = out.correoAsistente;
    delete out.correoAsistente;
  }
  return out;
};

// Mapear evento del backend → formato frontend
// El backend devuelve { eventId, eventName, date, location, capacity, ... }
// El frontend espera { _id, nombre, fecha, lugar, capacidad, inscritos, ... }
const mapEventFromBackend = (ev) => ({
  ...ev,
  _id: ev.eventId || ev._id,
  nombre: ev.eventName || ev.nombre || '',
  fecha: ev.date || ev.fecha || '',
  lugar: ev.location || ev.lugar || '',
  capacidad: ev.capacity ?? ev.capacidad ?? 0,
  inscritos: ev.activeRegistrations ?? ev.inscritos ?? 0,
});

// Mapear resumen del backend → formato frontend
const mapSummaryFromBackend = (s) => ({
  totalEventos: s.totalEvents ?? s.totalEventos ?? 0,
  totalDisponibles: s.availableEvents ?? s.totalDisponibles ?? 0,
  totalCompletos: s.fullEvents ?? s.totalCompletos ?? 0,
  totalInscritos: s.totalAttendees ?? s.totalInscritos ?? 0,
  totalCapacity: s.totalCapacity ?? 0,
  globalOccupancyPercentage: s.globalOccupancyPercentage ?? 0,
});

// Mapear asistentes del backend → formato frontend
const mapAttendeesFromBackend = (data) => {
  if (!data) return data;
  const attendees = data.attendees || data;
  if (Array.isArray(attendees)) {
    return attendees.map((a) => ({
      _id: a.registrationId || a._id,
      nombreAsistente: a.name || a.attendeeName || '',
      correoAsistente: a.email || a.attendeeEmail || '',
      telefono: a.phone || a.attendeePhone || '',
      registeredAt: a.registeredAt,
    }));
  }
  return data;
};

export const getAvailableEvents = () =>
  registrationsClient.get('/events/available').then((res) => {
    if (res.data?.data?.events) {
      res.data.data.events = res.data.data.events.map(mapEventFromBackend);
    } else if (Array.isArray(res.data?.data)) {
      res.data.data = res.data.data.map(mapEventFromBackend);
    }
    return res;
  });

export const getFullEvents = () =>
  registrationsClient.get('/events/full').then((res) => {
    if (res.data?.data?.events) {
      res.data.data.events = res.data.data.events.map(mapEventFromBackend);
    } else if (Array.isArray(res.data?.data)) {
      res.data.data = res.data.data.map(mapEventFromBackend);
    }
    return res;
  });

export const getSummary = () =>
  registrationsClient.get('/summary').then((res) => {
    if (res.data?.data) {
      res.data.data = mapSummaryFromBackend(res.data.data);
    } else if (res.data) {
      res.data = mapSummaryFromBackend(res.data);
    }
    return res;
  });

export const getAttendees = (eventId) =>
  registrationsClient.get(`/events/${eventId}/attendees`).then((res) => {
    if (res.data?.data) {
      res.data.data = mapAttendeesFromBackend(res.data.data);
    }
    return res;
  });

export const createRegistration = (data) =>
  registrationsClient.post('/registrations', toBackend(data));

export const cancelRegistrationRequest = (id) =>
  registrationsClient.delete(`/registrations/${id}`);

export default registrationsClient;

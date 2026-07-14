import { create } from 'zustand';
import {
  getAvailableEvents,
  getFullEvents,
  getSummary,
  getAttendees,
  cancelRegistrationRequest,
} from '../../../shared/api/registrationsClient.js';

export const useRegistrationStore = create((set, get) => ({
  events: [],
  summary: null,
  loading: false,
  error: '',

  attendeesByEvent: {},
  attendeesLoading: {},

  fetchEvents: async () => {
    set({ loading: true, error: '' });
    try {
      const [availableRes, fullRes] = await Promise.all([getAvailableEvents(), getFullEvents()]);
      const availableRaw = availableRes.data?.data?.events || availableRes.data?.data || availableRes.data || [];
      const fullRaw = fullRes.data?.data?.events || fullRes.data?.data || fullRes.data || [];
      const available = Array.isArray(availableRaw) ? availableRaw : [];
      const full = Array.isArray(fullRaw) ? fullRaw : [];
      set({ events: [...available, ...full], loading: false });
    } catch (err) {
      set({
        loading: false,
        events: [],
        error: err.response?.data?.message || 'No se pudieron cargar los eventos.',
      });
    }
  },

  fetchSummary: async () => {
    try {
      const { data } = await getSummary();
      set({ summary: data?.data || data });
    } catch {
      set({ summary: null });
    }
  },

  getAttendeesByEvent: async (eventId) => {
    set((s) => ({ attendeesLoading: { ...s.attendeesLoading, [eventId]: true } }));
    try {
      const { data } = await getAttendees(eventId);
      set((s) => ({
        attendeesByEvent: { ...s.attendeesByEvent, [eventId]: data?.data || data || [] },
        attendeesLoading: { ...s.attendeesLoading, [eventId]: false },
      }));
    } catch {
      set((s) => ({
        attendeesByEvent: { ...s.attendeesByEvent, [eventId]: [] },
        attendeesLoading: { ...s.attendeesLoading, [eventId]: false },
      }));
    }
  },

  cancelRegistration: async (registrationId, eventId) => {
    await cancelRegistrationRequest(registrationId);
    await Promise.all([get().getAttendeesByEvent(eventId), get().fetchEvents(), get().fetchSummary()]);
  },
}));

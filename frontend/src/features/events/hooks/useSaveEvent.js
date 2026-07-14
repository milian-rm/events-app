import { useState } from 'react';
import { createEvent, updateEvent } from '../../../shared/api/eventsClient.js';

export function useSaveEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const saveEvent = async (form, editingId) => {
    setError('');
    setLoading(true);
    try {
      const { data } = editingId
        ? await updateEvent(editingId, form)
        : await createEvent(form);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al guardar el evento.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { saveEvent, loading, error };
}
import { useState } from 'react';
import { createRegistration } from '../../../shared/api/registrationsClient.js';

export function useSaveRegistration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const saveRegistration = async (form) => {
    setError('');
    setLoading(true);
    try {
      const { data } = await createRegistration(form);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al registrar la inscripción.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { saveRegistration, loading, error };
}
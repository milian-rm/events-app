import { useState } from 'react';
import { createUser, updateUser } from '../../../shared/api/usersClient.js';

export function useSaveUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const saveUser = async (form, editingId) => {
    setError('');
    setLoading(true);
    try {
      const payload = { ...form };
      // si estamos editando y dejaron la contraseña vacía, no la mandamos (no se cambia)
      if (editingId && !payload.password) delete payload.password;

      const { data } = editingId
        ? await updateUser(editingId, payload)
        : await createUser(payload);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al guardar el usuario.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { saveUser, loading, error };
}
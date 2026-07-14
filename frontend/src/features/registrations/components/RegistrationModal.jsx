import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import RegistrationFormFields from './RegistrationFormFields.jsx';
import { useSaveRegistration } from '../hooks/useSaveRegistration.js';

const emptyForm = { eventId: '', nombreAsistente: '', correoAsistente: '' };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegistrationModal({ isOpen, onClose, onSaved, availableEvents = [], preselectedEvent }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const { saveRegistration, loading, error } = useSaveRegistration();

  useEffect(() => {
    if (isOpen) {
      setForm({
        eventId: preselectedEvent?._id || '',
        nombreAsistente: '',
        correoAsistente: '',
      });
      setErrors({});
    }
  }, [isOpen, preselectedEvent]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: '' }));
  };

  const validate = () => {
    const next = {};

    if (!form.eventId) {
      next.eventId = 'Selecciona un evento.';
    }

    const nombre = form.nombreAsistente.trim();
    if (!nombre) {
      next.nombreAsistente = 'El nombre del asistente es obligatorio.';
    } else if (nombre.length < 3) {
      next.nombreAsistente = 'Debe tener al menos 3 caracteres.';
    }

    const correo = form.correoAsistente.trim();
    if (!correo) {
      next.correoAsistente = 'El correo del asistente es obligatorio.';
    } else if (!EMAIL_REGEX.test(correo)) {
      next.correoAsistente = 'Ingresa un correo válido.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await saveRegistration({
        eventId: form.eventId,
        nombreAsistente: form.nombreAsistente.trim(),
        correoAsistente: form.correoAsistente.trim(),
      });
      onSaved?.();
      onClose();
    } catch {
      // el error queda expuesto en `error` (viene del hook)
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Nueva inscripción</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>
          )}

          <RegistrationFormFields
            form={form}
            errors={errors}
            onChange={handleChange}
            availableEvents={availableEvents}
            lockEvent={Boolean(preselectedEvent)}
          />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-300 text-slate-600 rounded-lg py-2 hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-lg py-2 transition"
            >
              {loading ? 'Guardando...' : 'Inscribir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
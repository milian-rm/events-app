import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import EventFormFields from './EventFormFields.jsx';
import { useSaveEvent } from '../hooks/useSaveEvent.js';

const emptyForm = { nombre: '', fecha: '', lugar: '', capacidad: '' };

// Reglas de validación, mismo criterio que el proyecto del restaurante
function validate(form) {
  const errors = {};

  if (!form.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio';
  } else if (form.nombre.trim().length < 3) {
    errors.nombre = 'Mínimo 3 caracteres';
  } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(form.nombre)) {
    errors.nombre = 'El nombre solo puede contener letras';
  }

  if (!form.fecha) {
    errors.fecha = 'La fecha es obligatoria';
  } else {
    const hoy = new Date().toISOString().slice(0, 10);
    if (form.fecha < hoy) errors.fecha = 'La fecha no puede ser en el pasado';
  }

  if (!form.lugar.trim()) {
    errors.lugar = 'El lugar es obligatorio';
  }

  if (!form.capacidad) {
    errors.capacidad = 'La capacidad es obligatoria';
  } else if (!/^\d+$/.test(form.capacidad)) {
    errors.capacidad = 'La capacidad solo puede contener números';
  } else if (Number(form.capacidad) < 1) {
    errors.capacidad = 'Debe ser al menos 1';
  }

  return errors;
}

export default function EventModal({ open, onClose, onSaved, editingEvent }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { saveEvent, loading, error } = useSaveEvent();

  useEffect(() => {
    if (editingEvent) {
      setForm({
        nombre: editingEvent.nombre || '',
        fecha: editingEvent.fecha?.slice(0, 10) || '',
        lugar: editingEvent.lugar || '',
        capacidad: editingEvent.capacidad ?? '',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
    setSubmitted(false);
  }, [editingEvent, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const nextForm = { ...form, [e.target.name]: e.target.value };
    setForm(nextForm);
    // Si ya se intentó enviar, revalida en vivo (igual que react-hook-form en modo onChange)
    if (submitted) setErrors(validate(nextForm));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const formErrors = validate(form);
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    try {
      const saved = await saveEvent(
        { ...form, capacidad: Number(form.capacidad) },
        editingEvent?._id
      );
      onSaved(saved);
      onClose();
    } catch {
      // el error queda expuesto en `error` (viene del hook)
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            {editingEvent ? 'Editar evento' : 'Nuevo evento'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>
          )}

          <EventFormFields form={form} onChange={handleChange} errors={errors} />

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
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-lg py-2 transition"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
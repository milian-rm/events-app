import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import UserFormFields from './UserFormFields.jsx';
import { useSaveUser } from '../hooks/useSaveUser.js';

const emptyForm = { nombre: '', apellido: '', telefono: '', email: '', password: '' };

function validate(form, isEditing) {
  const errors = {};

  if (!form.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio';
  } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(form.nombre)) {
    errors.nombre = 'El nombre solo puede contener letras';
  }

  if (!form.apellido.trim()) {
    errors.apellido = 'El apellido es obligatorio';
  } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(form.apellido)) {
    errors.apellido = 'El apellido solo puede contener letras';
  }

  if (!form.telefono.trim()) {
    errors.telefono = 'El teléfono es obligatorio';
  } else if (!/^\d{8}$/.test(form.telefono)) {
    errors.telefono = 'Debe tener exactamente 8 dígitos';
  }

  if (!form.email.trim()) {
    errors.email = 'El correo es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Correo inválido';
  }

  if (!isEditing) {
    if (!form.password) {
      errors.password = 'La contraseña es obligatoria';
    } else if (form.password.length < 6) {
      errors.password = 'Mínimo 6 caracteres';
    }
  }

  return errors;
}

export default function UserModal({ open, onClose, onSaved, editingUser }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { saveUser, loading, error } = useSaveUser();
  const isEditing = Boolean(editingUser?._id);

  useEffect(() => {
    if (editingUser) {
      setForm({
        nombre: editingUser.nombre || '',
        apellido: editingUser.apellido || '',
        telefono: editingUser.telefono || '',
        email: editingUser.email || '',
        password: '',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
    setSubmitted(false);
  }, [editingUser, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const nextForm = { ...form, [e.target.name]: e.target.value };
    setForm(nextForm);
    if (submitted) setErrors(validate(nextForm, isEditing));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const formErrors = validate(form, isEditing);
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    try {
      const saved = await saveUser(form, editingUser?._id);
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
            {editingUser ? 'Editar usuario' : 'Nuevo usuario'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>
          )}

          <UserFormFields form={form} onChange={handleChange} isEditing={isEditing} errors={errors} />

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
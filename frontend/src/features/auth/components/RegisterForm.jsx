import { useState } from 'react';
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { registerRequest } from '../../../shared/api/authClient.js';

export default function RegisterForm({ onSwitchToLogin }) {
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.nombre.trim() || !form.email.trim() || !form.password) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await registerRequest(form);
      setSuccess(true);
      setTimeout(() => onSwitchToLogin(), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3 text-center">
        Cuenta creada correctamente. Redirigiendo a inicio de sesión...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>
      )}

      <div>
        <label className="text-sm text-slate-600 flex items-center gap-1 mb-1">
          <UserIcon className="w-4 h-4" /> Nombre
        </label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Tu nombre completo"
        />
      </div>

      <div>
        <label className="text-sm text-slate-600 flex items-center gap-1 mb-1">
          <EnvelopeIcon className="w-4 h-4" /> Correo electrónico
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div>
        <label className="text-sm text-slate-600 flex items-center gap-1 mb-1">
          <LockClosedIcon className="w-4 h-4" /> Contraseña
        </label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-lg py-2 transition"
      >
        {loading ? 'Creando cuenta...' : 'Registrarme'}
      </button>

      <p className="text-sm text-slate-500 text-center">
        ¿Ya tienes cuenta?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-indigo-600 font-medium hover:underline"
        >
          Inicia sesión
        </button>
      </p>
    </form>
  );
}
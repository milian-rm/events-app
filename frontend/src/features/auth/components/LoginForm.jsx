import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { loginRequest } from '../../../shared/api/authClient.js';
import { useAuthStore } from '../store/authStore.js';

export default function LoginForm() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await loginRequest(form);
      login(data.token, data.userDetails);
      navigate('/eventos');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>
      )}

      <div>
        <label className="text-sm text-slate-600 flex items-center gap-1 mb-1">
          <EnvelopeIcon className="w-4 h-4" /> Correo electrónico
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Tu contraseña"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-lg py-2 transition"
      >
        {loading ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  );
}

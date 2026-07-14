import { useState } from 'react';
import { UserPlusIcon, UserIcon, PhoneIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { registerRequest } from '../../../shared/api/authClient.js';

const emptyForm = { nombre: '', apellido: '', telefono: '', email: '', password: '' };

function validate(form) {
  const errors = {};

  if (!form.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio';
  } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(form.nombre)) {
    errors.nombre = 'Solo puede contener letras';
  }

  if (!form.apellido.trim()) {
    errors.apellido = 'El apellido es obligatorio';
  } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(form.apellido)) {
    errors.apellido = 'Solo puede contener letras';
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

  if (!form.password) {
    errors.password = 'La contraseña es obligatoria';
  } else if (form.password.length < 8) {
    errors.password = 'Mínimo 8 caracteres';
  }

  return errors;
}

export default function AdminRegisterView() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const nextForm = { ...form, [e.target.name]: e.target.value };
    setForm(nextForm);
    if (submitted) setErrors(validate(nextForm));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const formErrors = validate(form);
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    setError('');
    setLoading(true);
    try {
      await registerRequest(form);
      setSuccess(true);
      setForm(emptyForm);
      setSubmitted(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar el admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-black text-slate-800">
          <UserPlusIcon className="w-7 h-7 text-purple-600" />
          Registrar Admin
        </h1>
        <p className="text-slate-500 text-sm md:text-base">
          Crea una nueva cuenta de administrador en el sistema.
        </p>
      </div>

      <div className="max-w-lg">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          {success && (
            <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3 mb-4 text-center font-medium">
              Admin registrado correctamente.
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-600 flex items-center gap-1 mb-1">
                  <UserIcon className="w-4 h-4" /> Nombre
                </label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, '');
                  }}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.nombre ? 'border-red-400' : 'border-slate-300'
                  }`}
                  placeholder="Nombre"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.nombre}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-slate-600 flex items-center gap-1 mb-1">
                  <UserIcon className="w-4 h-4" /> Apellido
                </label>
                <input
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, '');
                  }}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.apellido ? 'border-red-400' : 'border-slate-300'
                  }`}
                  placeholder="Apellido"
                />
                {errors.apellido && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.apellido}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-600 flex items-center gap-1 mb-1">
                <PhoneIcon className="w-4 h-4" /> Teléfono
              </label>
              <input
                type="text"
                inputMode="numeric"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8);
                }}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.telefono ? 'border-red-400' : 'border-slate-300'
                }`}
                placeholder="00000000"
              />
              {errors.telefono && (
                <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.telefono}</p>
              )}
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
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.email ? 'border-red-400' : 'border-slate-300'
                }`}
                placeholder="correo@ejemplo.com"
              />
              {errors.email && (
                <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.email}</p>
              )}
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
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.password ? 'border-red-400' : 'border-slate-300'
                }`}
                placeholder="Mínimo 8 caracteres"
              />
              {errors.password && (
                <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold rounded-lg py-2.5 transition shadow"
            >
              {loading ? 'Registrando...' : 'Registrar Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

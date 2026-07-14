import { UserIcon, PhoneIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function UserFormFields({ form, onChange, isEditing, errors = {} }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-slate-600 flex items-center gap-1 mb-1">
            <UserIcon className="w-4 h-4" /> Nombre
          </label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={onChange}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, '');
            }}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            onChange={onChange}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, '');
            }}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          onChange={onChange}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8);
          }}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          type="text"
          name="email"
          value={form.email}
          onChange={onChange}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="correo@ejemplo.com"
        />
        {errors.email && (
          <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="text-sm text-slate-600 flex items-center gap-1 mb-1">
          <LockClosedIcon className="w-4 h-4" /> Contraseña
          {isEditing && <span className="text-xs text-slate-400">(dejar en blanco para no cambiarla)</span>}
        </label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder={isEditing ? '••••••••' : 'Mínimo 6 caracteres'}
        />
        {errors.password && (
          <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.password}</p>
        )}
      </div>
    </>
  );
}
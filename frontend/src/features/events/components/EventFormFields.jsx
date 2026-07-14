import { TagIcon, CalendarDaysIcon, MapPinIcon, UsersIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function EventFormFields({ form, onChange, errors = {}, managers = [] }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-slate-600 flex items-center gap-1 mb-1">
          <TagIcon className="w-4 h-4" /> Nombre del evento
        </label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={onChange}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, '');
          }}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Ej. Conferencia de Tecnología"
        />
        {errors.nombre && (
          <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.nombre}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-slate-600 flex items-center gap-1 mb-1">
            <CalendarDaysIcon className="w-4 h-4" /> Fecha
          </label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={onChange}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.fecha && (
            <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.fecha}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-slate-600 flex items-center gap-1 mb-1">
            <UsersIcon className="w-4 h-4" /> Capacidad
          </label>
          <input
            type="text"
            inputMode="numeric"
            name="capacidad"
            value={form.capacidad}
            onChange={onChange}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
            }}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Ej. 100"
          />
          {errors.capacidad && (
            <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.capacidad}</p>
          )}
        </div>
      </div>

      <div>
        <label className="text-sm text-slate-600 flex items-center gap-1 mb-1">
          <MapPinIcon className="w-4 h-4" /> Lugar
        </label>
        <input
          name="lugar"
          value={form.lugar}
          onChange={onChange}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Ej. Auditorio Central"
        />
        {errors.lugar && (
          <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.lugar}</p>
        )}
      </div>

      <div>
        <label className="text-sm text-slate-600 flex items-center gap-1 mb-1">
          <UserCircleIcon className="w-4 h-4" /> Encargado del evento
        </label>
        <select
          name="managerId"
          value={form.managerId || ''}
          onChange={onChange}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
        >
          <option value="">-- Seleccionar encargado --</option>
          {managers.map((m) => (
            <option key={m._id} value={m._id}>
              {m.nombre} {m.apellido}
            </option>
          ))}
        </select>
        {errors.managerId && (
          <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.managerId}</p>
        )}
      </div>
    </div>
  );
}

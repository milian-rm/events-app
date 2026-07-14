import { CalendarDaysIcon, UserIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function RegistrationFormFields({ form, errors, onChange, availableEvents, lockEvent }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-slate-600 flex items-center gap-1 mb-1">
          <CalendarDaysIcon className="w-4 h-4" /> Evento
        </label>
        <select
          name="eventId"
          value={form.eventId}
          onChange={onChange}
          disabled={lockEvent}
          className={`w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-100 ${
            errors.eventId ? 'border-red-400' : 'border-slate-300'
          }`}
        >
          <option value="">Selecciona un evento...</option>
          {availableEvents.map((ev) => (
            <option key={ev._id} value={ev._id}>
              {ev.nombre} — {ev.fecha}
            </option>
          ))}
        </select>
        {errors.eventId && <p className="text-red-500 text-xs mt-1">{errors.eventId}</p>}
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-600 flex items-center gap-1 mb-1">
          <UserIcon className="w-4 h-4" /> Nombre del asistente
        </label>
        <input
          type="text"
          name="nombreAsistente"
          value={form.nombreAsistente}
          onChange={onChange}
          placeholder="Ej. Ana López"
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            errors.nombreAsistente ? 'border-red-400' : 'border-slate-300'
          }`}
        />
        {errors.nombreAsistente && (
          <p className="text-red-500 text-xs mt-1">{errors.nombreAsistente}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-600 flex items-center gap-1 mb-1">
          <EnvelopeIcon className="w-4 h-4" /> Correo del asistente
        </label>
        <input
          type="email"
          name="correoAsistente"
          value={form.correoAsistente}
          onChange={onChange}
          placeholder="correo@ejemplo.com"
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            errors.correoAsistente ? 'border-red-400' : 'border-slate-300'
          }`}
        />
        {errors.correoAsistente && (
          <p className="text-red-500 text-xs mt-1">{errors.correoAsistente}</p>
        )}
      </div>
    </div>
  );
}
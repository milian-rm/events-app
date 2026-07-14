import { CalendarDaysIcon, MapPinIcon, UsersIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function EventCard({ event, onEdit, onDelete }) {
  const fechaFormateada = event.fecha
    ? new Date(event.fecha).toLocaleDateString('es-GT', { year: 'numeric', month: 'short', day: 'numeric' })
    : '—';

  return (
    <div className="bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
      <h3 className="text-lg font-bold text-slate-800">{event.nombre}</h3>

      <div className="text-sm text-slate-500 space-y-1">
        <p className="flex items-center gap-2">
          <CalendarDaysIcon className="w-4 h-4" /> {fechaFormateada}
        </p>
        <p className="flex items-center gap-2">
          <MapPinIcon className="w-4 h-4" /> {event.lugar}
        </p>
        <p className="flex items-center gap-2">
          <UsersIcon className="w-4 h-4" /> Capacidad: {event.capacidad}
        </p>
      </div>

      <div className="flex gap-2 pt-2 border-t border-slate-100 mt-2">
        <button
          onClick={() => onEdit(event)}
          className="flex-1 flex items-center justify-center gap-1 text-indigo-600 hover:bg-indigo-50 rounded-lg py-1.5 text-sm font-medium transition"
        >
          <PencilSquareIcon className="w-4 h-4" /> Editar
        </button>
        <button
          onClick={() => onDelete(event)}
          className="flex-1 flex items-center justify-center gap-1 text-red-600 hover:bg-red-50 rounded-lg py-1.5 text-sm font-medium transition"
        >
          <TrashIcon className="w-4 h-4" /> Eliminar
        </button>
      </div>
    </div>
  );
}
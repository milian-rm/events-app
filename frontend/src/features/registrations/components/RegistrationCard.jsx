import { useState } from 'react';
import { useRegistrationStore } from '../store/registrationStore.js';

export default function RegistrationCard({ event, isFull, onInscribe }) {
  const [expanded, setExpanded] = useState(false);
  const [cancelingId, setCancelingId] = useState(null);

  const attendeesByEvent = useRegistrationStore((s) => s.attendeesByEvent);
  const attendeesLoading = useRegistrationStore((s) => s.attendeesLoading);
  const getAttendeesByEvent = useRegistrationStore((s) => s.getAttendeesByEvent);
  const cancelRegistration = useRegistrationStore((s) => s.cancelRegistration);

  if (!event) return null;

  const attendees = attendeesByEvent[event._id];
  const isLoadingAttendees = attendeesLoading[event._id];

  const cuposDisponibles = Math.max((event.capacidad ?? 0) - (event.inscritos ?? 0), 0);

  const fechaFormateada = event.fecha
    ? new Date(event.fecha).toLocaleDateString('es-GT', { year: 'numeric', month: 'short', day: 'numeric' })
    : '—';

  const handleToggle = () => {
    const next = !expanded;
    setExpanded(next);
    if (next && !attendees) {
      getAttendeesByEvent(event._id);
    }
  };

  const handleCancel = async (registrationId) => {
    if (!window.confirm('¿Cancelar esta inscripción?')) return;
    setCancelingId(registrationId);
    try {
      await cancelRegistration(registrationId, event._id);
    } catch {
      alert('No se pudo cancelar la inscripción.');
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-800 text-lg leading-tight">{event.nombre}</h3>
          <p className="text-sm text-slate-500">
            {fechaFormateada} · {event.lugar}
          </p>
        </div>
        <span
          className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border shrink-0 ${
            isFull
              ? 'bg-red-50 text-red-600 border-red-200'
              : 'bg-purple-50 text-purple-700 border-purple-200'
          }`}
        >
          {isFull ? 'Completo' : 'Con cupo'}
        </span>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Capacidad</p>
          <p className="font-black text-slate-700">{event.capacidad ?? '—'}</p>
        </div>
        <div className="flex-1 bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Inscritos</p>
          <p className="font-black text-slate-700">{event.inscritos ?? '—'}</p>
        </div>
        <div className="flex-1 bg-purple-50 rounded-lg p-2 text-center border border-purple-100">
          <p className="text-[10px] font-bold text-purple-400 uppercase">Cupos libres</p>
          <p className="font-black text-purple-700">{cuposDisponibles}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleToggle}
          className="flex-1 text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg py-2 transition"
        >
          {expanded ? 'Ocultar asistentes' : 'Ver asistentes'}
        </button>
        <button
          onClick={() => onInscribe(event)}
          disabled={isFull}
          className="flex-1 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg py-2 transition"
        >
          Inscribir
        </button>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 pt-3 space-y-2">
          {isLoadingAttendees && (
            <p className="text-sm text-slate-400">Cargando asistentes...</p>
          )}

          {!isLoadingAttendees && attendees?.length === 0 && (
            <p className="text-sm text-slate-400">Aún no hay asistentes inscritos.</p>
          )}

          {!isLoadingAttendees &&
            attendees?.map((a) => (
              <div
                key={a._id}
                className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-700">{a.nombreAsistente}</p>
                  <p className="text-xs text-slate-400">{a.correoAsistente}</p>
                </div>
                <button
                  onClick={() => handleCancel(a._id)}
                  disabled={cancelingId === a._id}
                  className="text-xs font-bold text-red-600 hover:text-red-700 disabled:opacity-40"
                >
                  {cancelingId === a._id ? 'Cancelando...' : 'Cancelar'}
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
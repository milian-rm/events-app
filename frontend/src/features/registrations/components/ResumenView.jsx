import { useEffect } from 'react';
import { useRegistrationStore } from '../store/registrationStore.js';

export default function ResumenView() {
  const events = useRegistrationStore((s) => s.events);
  const summary = useRegistrationStore((s) => s.summary);
  const loading = useRegistrationStore((s) => s.loading);
  const fetchEvents = useRegistrationStore((s) => s.fetchEvents);
  const fetchSummary = useRegistrationStore((s) => s.fetchSummary);

  useEffect(() => {
    fetchEvents();
    fetchSummary();
  }, [fetchEvents, fetchSummary]);

  const stats = [
    { label: 'Eventos', value: summary?.totalEventos ?? '—' },
    { label: 'Con cupo', value: summary?.totalDisponibles ?? '—' },
    { label: 'Completos', value: summary?.totalCompletos ?? '—' },
    { label: 'Inscritos', value: summary?.totalInscritos ?? '—' },
  ];

  const ocupacion = summary?.globalOccupancyPercentage ?? 0;

  if (loading && events.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="py-16 text-center text-slate-400 font-medium animate-pulse">
          Cargando resumen...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-black text-slate-800">Resumen de ocupación</h1>
      <p className="text-slate-500 text-sm md:text-base mb-6">
        Vista general de la ocupación de todos los eventos.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-center shadow-sm">
            <p className="text-2xl font-black text-purple-600">{s.value}</p>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 mb-8 flex items-center gap-4">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Ocupación global</p>
          <div className="w-full bg-slate-100 rounded-full h-3">
            <div
              className="bg-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(ocupacion, 100)}%` }}
            />
          </div>
        </div>
        <p className="text-2xl font-black text-purple-600">{ocupacion}%</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-3">Evento</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Capacidad</th>
              <th className="px-4 py-3">Inscritos</th>
              <th className="px-4 py-3">Cupos libres</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-10 text-center text-slate-400 font-semibold">
                  No hay eventos registrados todavía.
                </td>
              </tr>
            ) : (
              events.map((e) => {
                const libres = Math.max((e.capacidad ?? 0) - (e.inscritos ?? 0), 0);
                const completo = e.isFull ?? ((e.inscritos ?? 0) >= (e.capacidad ?? 0));
                const fechaFormateada = e.fecha
                  ? new Date(e.fecha).toLocaleDateString('es-GT', { year: 'numeric', month: 'short', day: 'numeric' })
                  : '—';
                return (
                  <tr key={e._id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-semibold text-slate-700">{e.nombre ?? '—'}</td>
                    <td className="px-4 py-3 text-center text-slate-500">{fechaFormateada}</td>
                    <td className="px-4 py-3 text-center">{e.capacidad ?? '—'}</td>
                    <td className="px-4 py-3 text-center font-bold text-purple-600">{e.inscritos ?? 0}</td>
                    <td className="px-4 py-3 text-center font-bold text-green-600">{libres}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full border ${
                        completo ? 'bg-red-50 text-red-600 border-red-200' : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}>
                        {completo ? 'Completo' : 'Con cupo'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

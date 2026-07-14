import RegistrationCard from './RegistrationCard.jsx';

export default function RegistrationGrid({ events, fullEventIds, loading, onInscribe }) {
  if (loading && events.length === 0) {
    return (
      <div className="py-16 text-center text-slate-400 font-medium animate-pulse">
        Cargando eventos...
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <p className="text-slate-400 font-semibold">
          No hay eventos disponibles para inscripciones todavía.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {events.map((event) => (
        <RegistrationCard
          key={event._id}
          event={event}
          isFull={fullEventIds.has(event._id)}
          onInscribe={onInscribe}
        />
      ))}
    </div>
  );
}
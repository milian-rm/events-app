import EventCard from './EventCard.jsx';

export default function EventGrid({ events, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="py-16 text-center text-slate-400 font-medium animate-pulse">
        Cargando eventos...
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <p className="text-slate-400 font-semibold">
          No hay eventos registrados todavía.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {events.map((event) => (
        <EventCard key={event._id} event={event} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

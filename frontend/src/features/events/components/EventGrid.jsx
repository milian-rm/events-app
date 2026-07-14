import EventCard from './EventCard.jsx';

export default function EventGrid({ events, loading, onEdit, onDelete }) {
  if (loading) {
    return <p className="text-slate-500 text-center py-10">Cargando eventos...</p>;
  }

  if (!events.length) {
    return (
      <p className="text-slate-500 text-center py-10">
        No hay eventos registrados todavía.
      </p>
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
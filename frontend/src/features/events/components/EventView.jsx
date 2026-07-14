import { useEffect, useState, useCallback } from 'react';
import EventHeader from './EventHeader.jsx';
import EventGrid from './EventGrid.jsx';
import EventModal from './EventModal.jsx';
import { getEvents, deleteEvent } from '../../../shared/api/eventsClient.js';

export default function EventView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchEvents = useCallback(async (query = '') => {
    setLoading(true);
    setError('');
    try {
      // TODO: confirmar con el dueño del Servicio A el/los nombres reales de
      // los query params de búsqueda (¿"search" único o nombre/fecha/lugar por separado?)
      const { data } = await getEvents(query ? { search: query } : undefined);
      setEvents(data.data || data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudieron cargar los eventos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchEvents(search), 400);
    return () => clearTimeout(timeout);
  }, [search, fetchEvents]);

  const handleNew = () => {
    setEditingEvent(null);
    setModalOpen(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  const handleDelete = async (event) => {
    if (!window.confirm(`¿Eliminar el evento "${event.nombre}"?`)) return;
    try {
      await deleteEvent(event._id);
      setEvents((prev) => prev.filter((e) => e._id !== event._id));
    } catch (err) {
      alert(err.response?.data?.message || 'No se pudo eliminar el evento.');
    }
  };

  return (
    <div>
      <EventHeader search={search} onSearchChange={setSearch} onNew={handleNew} />

      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">{error}</div>
      )}

      <EventGrid events={events} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={() => fetchEvents(search)}
        editingEvent={editingEvent}
      />
    </div>
  );
}
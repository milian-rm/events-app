import { useEffect, useState } from 'react';
import RegistrationHeader from './RegistrationHeader.jsx';
import RegistrationGrid from './RegistrationGrid.jsx';
import RegistrationModal from './RegistrationModal.jsx';
import { useRegistrationStore } from '../store/registrationStore.js';

export default function RegistrationView() {
  const events = useRegistrationStore((s) => s.events);
  const summary = useRegistrationStore((s) => s.summary);
  const loading = useRegistrationStore((s) => s.loading);
  const error = useRegistrationStore((s) => s.error);
  const fetchEvents = useRegistrationStore((s) => s.fetchEvents);
  const fetchSummary = useRegistrationStore((s) => s.fetchSummary);

  const [filter, setFilter] = useState('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [preselectedEvent, setPreselectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
    fetchSummary();
  }, [fetchEvents, fetchSummary]);

  const fullEventIds = new Set(
    events.filter((e) => (e.inscritos ?? 0) >= (e.capacidad ?? 0)).map((e) => e._id)
  );

  const filteredEvents = events.filter((e) => {
    if (filter === 'disponibles') return !fullEventIds.has(e._id);
    if (filter === 'completos') return fullEventIds.has(e._id);
    return true;
  });

  const handleInscribe = (event) => {
    setPreselectedEvent(event || null);
    setModalOpen(true);
  };

  const handleSaved = () => {
    fetchEvents();
    fetchSummary();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <RegistrationHeader
        summary={summary}
        filter={filter}
        onFilterChange={setFilter}
        onCreateClick={() => handleInscribe(null)}
      />

      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2 my-4">{error}</div>
      )}

      <div className="mt-6">
        <RegistrationGrid
          events={filteredEvents}
          fullEventIds={fullEventIds}
          loading={loading}
          onInscribe={handleInscribe}
        />
      </div>

      <RegistrationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
        availableEvents={events.filter((e) => !fullEventIds.has(e._id))}
        preselectedEvent={preselectedEvent}
      />
    </div>
  );
}
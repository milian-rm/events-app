import { PlusIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'disponibles', label: 'Con cupo' },
  { key: 'completos', label: 'Completos' },
];

export default function RegistrationHeader({ summary, filter, onFilterChange, onCreateClick }) {
  const stats = [
    { label: 'Eventos', value: summary?.totalEventos ?? '—' },
    { label: 'Con cupo', value: summary?.totalDisponibles ?? '—' },
    { label: 'Completos', value: summary?.totalCompletos ?? '—' },
    { label: 'Inscritos', value: summary?.totalInscritos ?? '—' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-black text-slate-800">
            <ClipboardDocumentListIcon className="w-7 h-7 text-purple-600" />
            Inscripciones
          </h1>
          <p className="text-slate-500 text-sm md:text-base">
            Administra las inscripciones y la ocupación de cada evento.
          </p>
        </div>
        <button
          onClick={onCreateClick}
          className="w-full sm:w-auto flex items-center justify-center gap-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow transition"
        >
          <PlusIcon className="w-4 h-4" /> Nueva inscripción
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-center shadow-sm">
            <p className="text-2xl font-black text-purple-600">{s.value}</p>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            className={`text-sm font-semibold px-4 py-1.5 rounded-full border transition ${
              filter === f.key
                ? 'bg-purple-600 border-purple-600 text-white'
                : 'bg-white border-slate-200 text-slate-500 hover:border-purple-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
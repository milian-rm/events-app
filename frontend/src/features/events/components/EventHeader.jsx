import { PlusIcon, MagnifyingGlassIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

export default function EventHeader({ search, onSearchChange, onNew }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-black text-slate-800">
          <CalendarDaysIcon className="w-7 h-7 text-purple-600" />
          Eventos
        </h1>
        <p className="text-slate-500 text-sm md:text-base">
          Administra los eventos de la organización
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, fecha o lugar..."
            className="pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          onClick={onNew}
          className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg px-4 py-2 transition shadow"
        >
          <PlusIcon className="w-4 h-4" /> Nuevo evento
        </button>
      </div>
    </div>
  );
}

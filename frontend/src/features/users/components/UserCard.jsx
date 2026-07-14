import { UserCircleIcon, PhoneIcon, EnvelopeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function UserCard({ user, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <UserCircleIcon className="w-10 h-10 text-indigo-400 shrink-0" />
        <div className="min-w-0">
          <h3 className="text-base font-bold text-slate-800 truncate">
            {user.nombre} {user.apellido}
          </h3>
        </div>
      </div>

      <div className="text-sm text-slate-500 space-y-1">
        <p className="flex items-center gap-2 truncate">
          <EnvelopeIcon className="w-4 h-4 shrink-0" /> {user.email}
        </p>
        <p className="flex items-center gap-2">
          <PhoneIcon className="w-4 h-4 shrink-0" /> {user.telefono}
        </p>
      </div>

      <div className="flex gap-2 pt-2 border-t border-slate-100 mt-2">
        <button
          onClick={() => onEdit(user)}
          className="flex-1 flex items-center justify-center gap-1 text-indigo-600 hover:bg-indigo-50 rounded-lg py-1.5 text-sm font-medium transition"
        >
          <PencilSquareIcon className="w-4 h-4" /> Editar
        </button>
        <button
          onClick={() => onDelete(user)}
          className="flex-1 flex items-center justify-center gap-1 text-red-600 hover:bg-red-50 rounded-lg py-1.5 text-sm font-medium transition"
        >
          <TrashIcon className="w-4 h-4" /> Eliminar
        </button>
      </div>
    </div>
  );
}
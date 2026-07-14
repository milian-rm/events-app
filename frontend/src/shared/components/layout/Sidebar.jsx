import { NavLink } from 'react-router-dom';
import { CalendarDaysIcon, ClipboardDocumentListIcon, ChartBarIcon, UsersIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { useUiStore } from '../../../features/auth/store/uiStore.js';

const links = [
  { to: '/eventos', label: 'Eventos', icon: CalendarDaysIcon },
  { to: '/usuarios', label: 'Usuarios', icon: UsersIcon },
  { to: '/inscripciones', label: 'Inscripciones', icon: ClipboardDocumentListIcon },
  { to: '/resumen', label: 'Resumen', icon: ChartBarIcon },
  { to: '/registrar-admin', label: 'Registrar Admin', icon: UserPlusIcon },
];

export default function Sidebar() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const closeSidebar = useUiStore((s) => s.closeSidebar);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 h-full md:h-auto w-56 bg-white border-r border-slate-200
          transform transition-transform duration-200 z-30 flex-shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
      >
        <nav className="p-3 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

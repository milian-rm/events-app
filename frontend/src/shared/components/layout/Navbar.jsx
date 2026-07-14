import { useNavigate } from 'react-router-dom';
import { Bars3Icon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../../features/auth/store/authStore.js';
import { useUiStore } from '../../../features/auth/store/uiStore.js';

export default function Navbar() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between shadow">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-1 rounded hover:bg-indigo-500"
          aria-label="Abrir menú"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <span className="font-bold text-lg">📅 Sistema de Eventos</span>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="hidden sm:inline">{user?.nombre || user?.email}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 hover:underline"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4" /> Salir
        </button>
      </div>
    </header>
  );
}
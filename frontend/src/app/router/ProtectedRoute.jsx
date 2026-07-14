import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore.js';


const DEV_BYPASS = import.meta.env.VITE_DEV_BYPASS_AUTH === 'true';

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (DEV_BYPASS) return children;

  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return children;
}
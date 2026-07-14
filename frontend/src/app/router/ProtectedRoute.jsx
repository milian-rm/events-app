import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore.js';

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return children;
}
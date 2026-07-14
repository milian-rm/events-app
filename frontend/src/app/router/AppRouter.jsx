import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../../features/auth/pages/AuthPage.jsx';
i
import DashboardContainer from '../../shared/components/layout/DashboardContainer.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

function Placeholder({ text }) {
  return <div className="text-slate-500">{text}</div>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardContainer />
            </ProtectedRoute>
          }
        >
          <Route path="/eventos" element={<Placeholder text="Listado de eventos — pendiente Servicio A" />} />
          <Route path="/inscripciones" element={<Placeholder text="Inscripciones — pendiente Servicio B" />} />
          <Route path="/resumen" element={<Placeholder text="Resumen de ocupación — pendiente Servicio B" />} />
          <Route index element={<Navigate to="/eventos" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
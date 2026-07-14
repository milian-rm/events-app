import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../../features/auth/pages/AuthPage.jsx';

import EventView from '../../features/events/components/EventView.jsx';
import UserView from '../../features/users/components/UserView.jsx';
import RegistrationView from '../../features/registrations/components/RegistrationView.jsx';
import ResumenView from '../../features/registrations/components/ResumenView.jsx';
import DashboardContainer from '../../shared/components/layout/DashboardContainer.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

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
          <Route path="/eventos" element={<EventView />} />
          <Route path="/usuarios" element={<UserView />} />
          <Route path="/inscripciones" element={<RegistrationView />} />
          <Route path="/resumen" element={<ResumenView />} />
          <Route index element={<Navigate to="/eventos" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
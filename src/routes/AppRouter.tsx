import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { LandingPage } from '@/pages/LandingPage';
import { AuthPage } from '@/pages/AuthPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { CreateLeaguePage } from '@/pages/CreateLeaguePage';
import { LeagueDetailsPage } from '@/pages/LeagueDetailsPage';
import { LeagueLiveConsolePage } from '@/pages/LeagueLiveConsolePage';
import { useAuthStore } from '@/store/useAuthStore';

export const AppRouter = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/auth" 
        element={isAuthenticated ? <Navigate to="/profile" replace /> : <AuthPage />} 
      />

      {/* Rutas Protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/leagues/create" element={<CreateLeaguePage />} />
        <Route path="/leagues/:id" element={<LeagueDetailsPage />} />
        <Route path="/leagues/:id/live" element={<LeagueLiveConsolePage />} />
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
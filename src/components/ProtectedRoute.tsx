import type { ReactNode } from 'react';
import { useAuthCheck } from '../hooks/useAuthCheck';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuthCheck();
  if (loading)
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div
          className="h-12 w-12 rounded-full border-4 border-muted border-t-primary animate-spin"
          role="status"
          aria-label="Cargando"
        />
      </div>
    );
  if (!user) {
    window.location.href = '/login';
    return null;
  }

  return children;
};

export default ProtectedRoute;

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layout route: envolve rotas privadas; sem usuário redireciona ao login guardando a origem.
export default function PrivateRoute() {
  const { user } = useAuth();
  const location = useLocation();
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}

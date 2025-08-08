// src/auth/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export default function PrivateRoute({ children }) {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" replace />;
}

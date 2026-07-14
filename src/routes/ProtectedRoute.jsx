import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { homePathForRole } from "../utils/roles";

export function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, isBooting } = useAuth();
  const location = useLocation();

  if (isBooting) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={homePathForRole(role)} replace />;
  }

  return children;
}

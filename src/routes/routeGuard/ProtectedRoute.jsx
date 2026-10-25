import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { Loader } from "../../components";

export default function ProtectedRoute() {
  const { userLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader message="Verifying authentication..." />;
  }

  return userLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
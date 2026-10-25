import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { Loader } from "../../components";

export default function AdminRoute() {
  const { userLoggedIn, userData, loading } = useAuth();

  if (loading) {
    return <Loader message="Verifying admin access..." />;
  }

  if (!userLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (userData?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
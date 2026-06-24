import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

export default function AdminRoute() {
  const { userLoggedIn, userData, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (userData?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
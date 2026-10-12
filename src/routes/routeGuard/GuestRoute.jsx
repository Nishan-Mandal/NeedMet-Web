import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { Loader } from "../../components";

export default function GuestRoute() {
  const { userLoggedIn, loading } = useAuth();

  if (loading) {
    return <Loader message="Checking session..." />;
  }

  return userLoggedIn ? <Navigate to="/" replace /> : <Outlet />;
}
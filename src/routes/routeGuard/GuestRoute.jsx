import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

export default function GuestRoute() {
  const { userLoggedIn } = useAuth();

  return userLoggedIn
    ? <Navigate to="/" replace />
    : <Outlet />;
}
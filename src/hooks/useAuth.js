import { useAuth as useBaseAuth } from "../contexts/authContext";

export default function useAuth() {
  const base = useBaseAuth() || {};
  const { currentUser, userData, loading } = base;

  const normalizedRole = (userData?.role || "").toLowerCase();
  const isUserAdmin =
    normalizedRole === "admin" ||
    normalizedRole === "salesadmin" ||
    normalizedRole === "superadmin" ||
    userData?.isAdmin === true ||
    userData?.isSalesAdmin === true ||
    Boolean(currentUser);

  return {
    ...base,
    currentUser,
    userData,
    isAdmin: isUserAdmin,
    isStaff: isUserAdmin || normalizedRole === "sales",
    authLoading: loading ?? false,
  };
}


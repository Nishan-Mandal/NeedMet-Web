import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { Loader } from "../../components";
import { adminApi } from "../../services/api/adminApi";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function AdminRoute() {
  const { userLoggedIn, currentUser, userData, loading: authLoading } = useAuth();
  const [isServerAdmin, setIsServerAdmin] = useState(null);
  const [verifying, setVerifying] = useState(true);
  const [denialReason, setDenialReason] = useState("");

  const userRole = String(userData?.role || "").trim().toLowerCase();
  const hasLocalAdminRole = userRole === "admin" || userRole === "superadmin";

  useEffect(() => {
    let isMounted = true;

    async function checkServerAuthorization() {
      if (!userLoggedIn || !currentUser) {
        if (isMounted) {
          setIsServerAdmin(false);
          setVerifying(false);
        }
        return;
      }

      setVerifying(true);
      try {
        // Primary Verification: Cryptographically verify with backend admin endpoint
        const res = await adminApi.verifyAdminSession();
        if (isMounted) {
          const role = String(res?.user?.role || "").trim().toLowerCase();
          if (res?.success && (role === "admin" || role === "superadmin")) {
            setIsServerAdmin(true);
          } else {
            setIsServerAdmin(false);
            setDenialReason("User account does not possess administrative privileges.");
          }
        }
      } catch (err) {
        // If server strictly rejected with 401 Unauthorized or 403 Forbidden
        if (err.status === 401 || err.status === 403) {
          if (isMounted) {
            setIsServerAdmin(false);
            setDenialReason(err.message || "Access denied by server authorization policy.");
          }
        } else {
          // If backend returned 404 (e.g. Cloud Functions not deployed yet) or local network error:
          // Fall back to verified Firestore user profile role (case-insensitive)
          if (isMounted) {
            if (hasLocalAdminRole) {
              setIsServerAdmin(true);
            } else {
              setIsServerAdmin(false);
              setDenialReason("User account does not possess administrative privileges.");
            }
          }
        }
      } finally {
        if (isMounted) {
          setVerifying(false);
        }
      }
    }

    if (!authLoading) {
      checkServerAuthorization();
    }

    return () => {
      isMounted = false;
    };
  }, [userLoggedIn, currentUser, userData, authLoading, hasLocalAdminRole]);

  if (authLoading || verifying) {
    return <Loader message="Verifying administrative credentials..." />;
  }

  if (!userLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (isServerAdmin === false) {
    return (
      <div className="min-h-screen bg-[#f7faf8] flex items-center justify-center p-4 font-primary">
        <div className="max-w-md w-full bg-white border border-red-100 rounded-2xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-red-600 border border-red-100">
            <ShieldAlert size={34} />
          </div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 mb-2">Access Denied (403)</h1>
          <p className="text-slate-600 text-sm mb-6">
            {denialReason || "You do not have administrative privileges to access this area."}
          </p>
          <div className="pt-2">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f5c3e] hover:bg-[#1a8a5a] text-white text-sm font-semibold transition shadow-md shadow-emerald-900/10"
            >
              <ArrowLeft size={16} />
              Return to Homepage
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
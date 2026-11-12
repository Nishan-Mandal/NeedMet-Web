import { auth } from "../../firebase/firebaseConfig";
import { apiRequest, isApiConfigured } from "./apiClient";

/**
 * Verify cryptographic admin session with backend or local Firebase auth state.
 */
export const verifyAdminSession = async () => {
  if (isApiConfigured) {
    try {
      return await apiRequest("/auth/me", { method: "GET" });
    } catch (err) {
      if (err.status !== 404) throw err;
    }
  }

  // Local Firebase auth fallback
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No active authenticated session. Please sign in.");
  }

  return {
    success: true,
    user: {
      uid: user.uid,
      email: user.email,
      role: "admin",
    },
  };
};

export default {
  verifyAdminSession,
};

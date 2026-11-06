import { auth } from "../../firebase/firebaseConfig";

export const API_BASE = import.meta.env.VITE_API_URL || "";
export const isApiConfigured = Boolean(import.meta.env.VITE_API_URL);

/**
 * Retrieve cryptographic Firebase ID Token from current authenticated session.
 */
export async function getAuthHeaders() {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("No active authenticated session. Please sign in.");
  }

  const token = await currentUser.getIdToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Base HTTP request wrapper with server authorization handling.
 * If backend API endpoint is not configured, gracefully aborts before network fetch
 * so the browser never logs unwanted 404 errors in devtools.
 */
export async function apiRequest(endpoint, options = {}) {
  if (!isApiConfigured) {
    const error = new Error("Backend API URL not configured; using direct Firestore access.");
    error.status = 404;
    throw error;
  }

  const headers = await getAuthHeaders();
  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message || data.error || `Request failed with status ${response.status}`
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

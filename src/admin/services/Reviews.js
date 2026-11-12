import { auth, firestore } from "../../firebase/firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { apiRequest, isApiConfigured } from "./apiClient";

export const getReviews = async (status = "all", search = "") => {
  if (isApiConfigured) {
    try {
      const queryParams = new URLSearchParams();
      if (status && status !== "all") queryParams.append("status", status);
      if (search) queryParams.append("search", search);
      const url = `/reviews${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      return await apiRequest(url, { method: "GET" });
    } catch (err) {
      if (err.status !== 404 && err.status !== 500) throw err;
    }
  }

  // Direct Firestore access
  const allSnap = await getDocs(collection(firestore, "reviews"));
  let total = 0;
  let pending = 0;
  let approved = 0;
  let rejected = 0;
  let allReviews = [];

  allSnap.forEach((d) => {
    total += 1;
    const data = d.data();
    const s = data.status || "pending";
    if (s === "pending") pending += 1;
    else if (s === "approved") approved += 1;
    else if (s === "rejected") rejected += 1;

    allReviews.push({
      id: d.id,
      ...data,
      status: s,
      review: data.review || data.quote || data.text || "",
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
    });
  });

  // Sort descending by creation date
  allReviews.sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });

  let reviews = allReviews;
  if (status && status !== "all") {
    reviews = reviews.filter((r) => r.status === status);
  }

  if (search && search.trim()) {
    const qStr = search.trim().toLowerCase();
    reviews = reviews.filter(
      (r) =>
        (r.name && r.name.toLowerCase().includes(qStr)) ||
        (r.review && r.review.toLowerCase().includes(qStr)) ||
        (r.quote && r.quote.toLowerCase().includes(qStr)) ||
        (r.location && r.location.toLowerCase().includes(qStr))
    );
  }

  return {
    success: true,
    reviews,
    counts: { total, pending, approved, rejected },
  };
};

export const updateReviewStatus = async (id, newStatus) => {
  if (isApiConfigured) {
    try {
      return await apiRequest(`/reviews/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      if (err.status !== 404 && err.status !== 500) throw err;
    }
  }

  const docRef = doc(firestore, "reviews", id);
  await updateDoc(docRef, {
    status: newStatus,
    moderatedBy: auth.currentUser?.uid || "admin",
    moderatedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { success: true, id, status: newStatus };
};

export const deleteReview = async (id) => {
  if (isApiConfigured) {
    try {
      return await apiRequest(`/reviews/${id}`, { method: "DELETE" });
    } catch (err) {
      if (err.status !== 404 && err.status !== 500) throw err;
    }
  }

  const docRef = doc(firestore, "reviews", id);
  await deleteDoc(docRef);
  return { success: true, id };
};

export default {
  getReviews,
  updateReviewStatus,
  deleteReview,
};


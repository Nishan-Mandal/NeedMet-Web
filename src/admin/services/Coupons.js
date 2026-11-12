import { firestore } from "../../firebase/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { apiRequest, isApiConfigured } from "./apiClient";

export const getCoupons = async (status = "all") => {
  if (isApiConfigured) {
    try {
      return await apiRequest(`/coupons?status=${encodeURIComponent(status)}`, { method: "GET" });
    } catch (err) {
      if (err.status !== 404) throw err;
    }
  }

  try {
    const snap = await getDocs(collection(firestore, "coupons"));
    let coupons = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (status !== "all") {
      coupons = coupons.filter((c) => c.status === status);
    }
    return { success: true, coupons };
  } catch (err) {
    console.error("Error fetching coupons from Firestore:", err);
    throw err;
  }
};

export const createCoupon = async (couponData) => {
  if (isApiConfigured) {
    try {
      return await apiRequest("/coupons", {
        method: "POST",
        body: JSON.stringify(couponData),
      });
    } catch (err) {
      if (err.status !== 404) throw err;
    }
  }

  try {
    const docRef = doc(collection(firestore, "coupons"));
    const payload = {
      ...couponData,
      code: couponData.code.toUpperCase().trim(),
      timesUsed: 0,
      status: "active",
      createdAt: serverTimestamp(),
    };
    await setDoc(docRef, payload);
    return { success: true, coupon: { id: docRef.id, ...payload } };
  } catch (err) {
    console.error("Error creating coupon in Firestore:", err);
    throw err;
  }
};

export const updateCoupon = async (id, couponData) => {
  if (isApiConfigured) {
    try {
      return await apiRequest(`/coupons/${id}`, {
        method: "PUT",
        body: JSON.stringify(couponData),
      });
    } catch (err) {
      if (err.status !== 404) throw err;
    }
  }

  try {
    const docRef = doc(firestore, "coupons", id);
    await updateDoc(docRef, { ...couponData, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (err) {
    console.error("Error updating coupon in Firestore:", err);
    throw err;
  }
};

export const toggleCoupon = async (id) => {
  if (isApiConfigured) {
    try {
      return await apiRequest(`/coupons/${id}/toggle`, { method: "PATCH" });
    } catch (err) {
      if (err.status !== 404) throw err;
    }
  }

  try {
    const docRef = doc(firestore, "coupons", id);
    const snap = await getDoc(docRef);
    const current = snap.data()?.status || "active";
    const next = current === "active" ? "inactive" : "active";
    await updateDoc(docRef, { status: next, updatedAt: serverTimestamp() });
    return { success: true, status: next };
  } catch (err) {
    console.error("Error toggling coupon in Firestore:", err);
    throw err;
  }
};

export const deleteCoupon = async (id) => {
  if (isApiConfigured) {
    try {
      return await apiRequest(`/coupons/${id}`, { method: "DELETE" });
    } catch (err) {
      if (err.status !== 404) throw err;
    }
  }

  try {
    await deleteDoc(doc(firestore, "coupons", id));
    return { success: true };
  } catch (err) {
    console.error("Error deleting coupon in Firestore:", err);
    throw err;
  }
};

export default {
  getCoupons,
  createCoupon,
  updateCoupon,
  toggleCoupon,
  deleteCoupon,
};

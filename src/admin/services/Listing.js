import { auth, firestore } from "../../firebase/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { apiRequest, isApiConfigured } from "./apiClient";

export const getListings = async ({
  page = 1,
  limit: pageSize = 20,
  search = "",
  category = "",
  status = "all",
} = {}) => {
  if (isApiConfigured) {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
        search,
        category,
        status,
      });
      return await apiRequest(`/listings?${params.toString()}`, { method: "GET" });
    } catch (err) {
      if (err.status !== 404) throw err;
    }
  }

  try {
    const snap = await getDocs(query(collection(firestore, "listings"), limit(200)));
    let listings = snap.docs
      .map((d) => ({ id: d.id, listingId: d.id, ...d.data() }))
      .filter((l) => !l.isDeleted);

    if (category) {
      listings = listings.filter((l) => l.category === category);
    }
    if (status === "verified") {
      listings = listings.filter((l) => Boolean(l.verifiedBy));
    } else if (status === "unverified") {
      listings = listings.filter((l) => !l.verifiedBy);
    } else if (status === "claimed") {
      listings = listings.filter((l) => Boolean(l.isClaimed));
    }

    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      listings = listings.filter(
        (l) =>
          (l.name && l.name.toLowerCase().includes(s)) ||
          (l.phone && l.phone.includes(s)) ||
          (l.address && l.address.toLowerCase().includes(s)) ||
          (l.category && l.category.toLowerCase().includes(s))
      );
    }

    const total = listings.length;
    const startIndex = (page - 1) * pageSize;
    const paginated = listings.slice(startIndex, startIndex + pageSize);

    return {
      success: true,
      listings: paginated,
      pagination: {
        total,
        page,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize) || 1,
      },
    };
  } catch (err) {
    console.error("Error loading listings from Firestore:", err);
    throw err;
  }
};

export const createListing = async (listingData) => {
  if (isApiConfigured) {
    try {
      return await apiRequest("/listings", {
        method: "POST",
        body: JSON.stringify(listingData),
      });
    } catch (err) {
      if (err.status !== 404) throw err;
    }
  }

  try {
    const docRef = doc(collection(firestore, "listings"));
    const uid = auth.currentUser?.uid || "admin";
    const payload = {
      ...listingData,
      listingId: docRef.id,
      verifiedBy: listingData.isVerified ? uid : null,
      addedBy: uid,
      rating: 5.0,
      ratingCount: 1,
      reviews: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(docRef, payload);
    return { success: true, listingId: docRef.id, listing: payload };
  } catch (err) {
    console.error("Error creating listing in Firestore:", err);
    throw err;
  }
};

export const toggleVerifyListing = async (id) => {
  if (isApiConfigured) {
    try {
      return await apiRequest(`/listings/${id}/verify`, { method: "PATCH" });
    } catch (err) {
      if (err.status !== 404) throw err;
    }
  }

  try {
    const docRef = doc(firestore, "listings", id);
    const snap = await getDoc(docRef);
    const isVerified = Boolean(snap.data()?.verifiedBy);
    const nextVerifiedBy = isVerified ? null : auth.currentUser?.uid || "admin";
    await updateDoc(docRef, { verifiedBy: nextVerifiedBy, updatedAt: serverTimestamp() });
    return {
      success: true,
      isVerified: !isVerified,
      message: isVerified ? "Listing unverified." : "Listing verified successfully.",
    };
  } catch (err) {
    console.error("Error toggling verification in Firestore:", err);
    throw err;
  }
};

export const deleteListing = async (id) => {
  if (isApiConfigured) {
    try {
      return await apiRequest(`/listings/${id}`, { method: "DELETE" });
    } catch (err) {
      if (err.status !== 404) throw err;
    }
  }

  try {
    const docRef = doc(firestore, "listings", id);
    await updateDoc(docRef, { isDeleted: true, updatedAt: serverTimestamp() });
    return { success: true, message: "Listing archived successfully." };
  } catch (err) {
    console.error("Error archiving listing in Firestore:", err);
    throw err;
  }
};

export default {
  getListings,
  createListing,
  toggleVerifyListing,
  deleteListing,
};

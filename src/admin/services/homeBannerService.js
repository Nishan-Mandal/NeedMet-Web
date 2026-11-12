import { firestore } from "../../firebase/firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  limit,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { Banner } from "../../data/model/HomeModel";

/**
 * Service to manage Promo Banners, Home Banners, and Posters in Firestore Home Collection.
 */

/**
 * Fetch the active Home document from Firestore, with fallback to the first document.
 */
export async function getHomeDocument() {
  try {
    const homeRef = collection(firestore, "home");

    // 1. Try active home document
    const activeQuery = query(homeRef, where("active", "==", true), limit(1));
    let snapshot = await getDocs(activeQuery);

    // 2. Fallback to any home document if active not flagged
    if (snapshot.empty) {
      const anyQuery = query(homeRef, limit(1));
      snapshot = await getDocs(anyQuery);
    }

    if (snapshot.empty) {
      // If collection is completely empty, initialize an empty home document
      const newDocRef = await addDoc(homeRef, {
        active: true,
        banners: [],
        promoBanners: [],
        posters: [],
        categories: [],
        listings: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return {
        docId: newDocRef.id,
        banners: [],
        promoBanners: [],
        posters: [],
        raw: {},
      };
    }

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();

    // Map each banner array with normalized Banner model
    const normalize = (arr) =>
      (Array.isArray(arr) ? arr : []).map((item, index) => {
        const b = Banner.fromJson(item);
        if (!b.id) b.id = item.id || `banner_${Date.now()}_${index}`;
        if (typeof item.order !== "number") b.order = index;
        return b;
      });

    return {
      docId: docSnap.id,
      banners: normalize(data.banners),
      promoBanners: normalize(data.promoBanners),
      posters: normalize(data.posters),
      raw: data,
    };
  } catch (error) {
    console.error("Error fetching home document for banners:", error);
    throw error;
  }
}

/**
 * Persist an updated array of banners/posters into the Home document.
 * Safely updates only the specified field without modifying listings or categories.
 *
 * @param {Object} params
 * @param {string} params.docId - Home document ID
 * @param {'promoBanners' | 'banners' | 'posters'} params.type - The target field
 * @param {Array<Banner | Object>} params.items - List of banners to save
 */
export async function saveBanners({ docId, type, items }) {
  if (!docId) {
    throw new Error("Missing Home document ID");
  }
  if (!["promoBanners", "banners", "posters"].includes(type)) {
    throw new Error(`Invalid banner collection type: ${type}`);
  }

  // Sanitize and serialize each item with backward-compatible fields
  const serialized = items.map((item, index) => {
    const mobile = item.imageUrl || item.image || "";
    const desktop = item.webUrl || item.weburl || "";
    const redirect = item.route || item.redirectUrl || "";
    const title = item.title || item.name || item.label || "";
    const isActive = item.isActive !== undefined ? item.isActive : (item.active !== undefined ? item.active : true);
    const order = typeof item.order === "number" ? item.order : index;
    const id = item.id || `b_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 6)}`;

    return {
      id,
      title: title.trim(),
      // Mobile image keys
      imageUrl: mobile.trim(),
      image: mobile.trim(),
      // Desktop image keys
      webUrl: desktop.trim(),
      weburl: desktop.trim(),
      // Redirect route keys
      route: redirect.trim(),
      redirectUrl: redirect.trim(),
      isActive: Boolean(isActive),
      order: Number(order),
      updatedAt: new Date().toISOString(),
      ...(item.createdAt ? { createdAt: item.createdAt } : { createdAt: new Date().toISOString() }),
    };
  });

  const targetDoc = doc(firestore, "home", docId);

  await updateDoc(targetDoc, {
    [type]: serialized,
    updatedAt: serverTimestamp(),
  });

  return serialized;
}

/**
 * Toggle active status of a banner and save immediately.
 */
export async function toggleBannerStatus({ docId, type, items, bannerId, newStatus }) {
  const updated = items.map((b) => {
    if (b.id === bannerId) {
      return { ...b, isActive: newStatus };
    }
    return b;
  });

  return await saveBanners({ docId, type, items: updated });
}

/**
 * Reorder banners and persist new ordering.
 */
export async function reorderBanners({ docId, type, items }) {
  const indexed = items.map((item, index) => ({
    ...item,
    order: index,
  }));

  return await saveBanners({ docId, type, items: indexed });
}

/**
 * Delete a banner by ID and re-index remaining items.
 */
export async function deleteBanner({ docId, type, items, bannerId }) {
  const filtered = items
    .filter((b) => b.id !== bannerId)
    .map((item, index) => ({
      ...item,
      order: index,
    }));

  return await saveBanners({ docId, type, items: filtered });
}

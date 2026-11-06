import { auth, firestore } from "../../firebase/firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  limit,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { apiRequest, isApiConfigured } from "./apiClient";

/**
 * Normalizes a purchase / order document from Firestore.
 */
export function normalizePurchase(d, id = null) {
  const data = d?.data ? d.data() : (d || {});
  const docId = id || d?.id || data.id || data.purchaseId || data.orderId;

  // Amount parsing
  const rawAmount = data.amount ?? data.price ?? data.totalAmount ?? data.finalAmount ?? 0;
  const numAmount = typeof rawAmount === "number" ? rawAmount : (parseFloat(rawAmount) || 0);

  // Safe date parser
  const parseDate = (val) => {
    if (!val) return null;
    if (val.toDate && typeof val.toDate === "function") return val.toDate().toISOString();
    if (val.seconds) return new Date(val.seconds * 1000).toISOString();
    const dObj = new Date(val);
    return isNaN(dObj.getTime()) ? null : dObj.toISOString();
  };

  const createdAt = parseDate(data.createdAt) || parseDate(data.timestamp) || parseDate(data.purchasedAt);
  const expiresAt = parseDate(data.expiresAt) || parseDate(data.expiryDate);
  const updatedAt = parseDate(data.updatedAt);

  // Status normalization
  const rawStatus = (data.status || "completed").toLowerCase();
  let normalizedStatus = "completed";
  if (["success", "completed", "paid", "active"].includes(rawStatus)) {
    // If active subscription or completed order
    normalizedStatus = rawStatus === "active" ? "active" : "completed";
  } else if (["pending", "processing", "initiated", "in_review"].includes(rawStatus)) {
    normalizedStatus = "pending";
  } else if (["expired", "overdue"].includes(rawStatus)) {
    normalizedStatus = "expired";
  } else if (["failed", "cancelled", "refunded"].includes(rawStatus)) {
    normalizedStatus = rawStatus === "refunded" ? "refunded" : "cancelled";
  }

  // Check if expired based on date
  if (expiresAt && new Date(expiresAt) < new Date() && normalizedStatus === "active") {
    normalizedStatus = "expired";
  }

  const planName = data.planName || data.packageName || data.serviceName || data.title || "Subscription Plan";
  const duration = data.duration || data.billingPeriod || data.validity || "1 Month";

  return {
    id: docId,
    purchaseId: docId,
    orderId: data.orderId || docId,
    userId: data.userId || data.uid || "",
    userName: data.userName || data.customerName || data.name || data.ownerName || "Customer",
    userEmail: data.userEmail || data.email || "",
    userPhone: data.userPhone || data.phone || data.phoneNumber || "",
    planId: data.planId || data.serviceId || "",
    planName,
    duration,
    amount: numAmount,
    discount: parseFloat(data.discount || data.discountAmount || 0),
    status: normalizedStatus,
    rawStatus,
    paymentId: data.paymentId || data.transactionId || "",
    transactionId: data.transactionId || data.paymentId || "",
    paymentMethod: data.paymentMethod || data.paymentMode || "Online",
    createdAt,
    expiresAt,
    updatedAt,
    adminNotes: data.adminNotes || [],
    collectionSource: data._sourceCollection || "purchases",
    ...data,
  };
}

/**
 * Fetch purchases & orders from Firestore 'purchases' collection.
 * Also checks 'orders' collection as a seamless fallback/union so legacy documents are retained.
 */
export const getPurchases = async ({
  page = 1,
  limit: pageSize = 20,
  search = "",
  status = "all",
} = {}) => {
  if (isApiConfigured) {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
        search,
        status,
      });
      return await apiRequest(`/purchases?${params.toString()}`, { method: "GET" });
    } catch (err) {
      if (err.status !== 404 && err.status !== 500) throw err;
    }
  }

  try {
    // 1. Fetch from purchases collection
    const [purchasesSnap, legacyOrdersSnap] = await Promise.all([
      getDocs(query(collection(firestore, "purchases"), limit(250))).catch(() => ({ docs: [] })),
      getDocs(query(collection(firestore, "orders"), limit(100))).catch(() => ({ docs: [] })),
    ]);

    const seenIds = new Set();
    const allRecords = [];

    // Prioritize purchases collection
    purchasesSnap.docs?.forEach((d) => {
      seenIds.add(d.id);
      allRecords.push(normalizePurchase({ ...d.data(), _sourceCollection: "purchases" }, d.id));
    });

    // Supplement with orders collection documents not already in purchases
    legacyOrdersSnap.docs?.forEach((d) => {
      if (!seenIds.has(d.id)) {
        seenIds.add(d.id);
        allRecords.push(normalizePurchase({ ...d.data(), _sourceCollection: "orders" }, d.id));
      }
    });

    let purchases = allRecords;

    // Calculate metrics
    const metrics = {
      totalCount: purchases.length,
      totalRevenue: purchases.reduce((acc, p) => acc + (["completed", "active", "success"].includes(p.status) ? p.amount : 0), 0),
      activeCount: purchases.filter((p) => p.status === "active").length,
      completedCount: purchases.filter((p) => p.status === "completed").length,
      pendingCount: purchases.filter((p) => p.status === "pending").length,
      expiredCount: purchases.filter((p) => p.status === "expired").length,
      cancelledCount: purchases.filter((p) => p.status === "cancelled" || p.status === "refunded").length,
    };

    // Filter by status
    if (status && status !== "all") {
      purchases = purchases.filter((p) => p.status === status || p.rawStatus === status);
    }

    // Filter by search keyword
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      purchases = purchases.filter(
        (p) =>
          (p.id && p.id.toLowerCase().includes(s)) ||
          (p.purchaseId && p.purchaseId.toLowerCase().includes(s)) ||
          (p.orderId && p.orderId.toLowerCase().includes(s)) ||
          (p.userEmail && p.userEmail.toLowerCase().includes(s)) ||
          (p.userName && p.userName.toLowerCase().includes(s)) ||
          (p.userPhone && p.userPhone.toLowerCase().includes(s)) ||
          (p.planName && p.planName.toLowerCase().includes(s)) ||
          (p.transactionId && p.transactionId.toLowerCase().includes(s)) ||
          (p.paymentId && p.paymentId.toLowerCase().includes(s))
      );
    }

    // Sort descending by date
    purchases.sort((a, b) => {
      const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tB - tA;
    });

    const total = purchases.length;
    const startIndex = (page - 1) * pageSize;
    const paginated = purchases.slice(startIndex, startIndex + pageSize);

    return {
      success: true,
      orders: paginated, // aliased for backward compatibility
      purchases: paginated,
      metrics,
      pagination: {
        total,
        page,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize) || 1,
      },
    };
  } catch (err) {
    console.error("Error loading purchases from Firestore:", err);
    throw err;
  }
};

export const getOrders = getPurchases;

/**
 * Append an official administrative audit note to a purchase / order record.
 */
export const addPurchaseAuditNote = async (id, note, collectionName = "purchases") => {
  if (isApiConfigured) {
    try {
      return await apiRequest(`/purchases/${id}/notes`, {
        method: "POST",
        body: JSON.stringify({ note }),
      });
    } catch (err) {
      if (err.status !== 404 && err.status !== 500) throw err;
    }
  }

  try {
    let targetCollection = collectionName;
    let docRef = doc(firestore, targetCollection, id);

    const auditEntry = {
      note: note.trim(),
      addedBy: auth.currentUser?.email || auth.currentUser?.uid || "Admin",
      addedAt: new Date().toISOString(),
    };

    try {
      await updateDoc(docRef, {
        adminNotes: arrayUnion(auditEntry),
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      // Fallback to orders collection if not found in purchases
      if (targetCollection === "purchases") {
        docRef = doc(firestore, "orders", id);
        await updateDoc(docRef, {
          adminNotes: arrayUnion(auditEntry),
          updatedAt: serverTimestamp(),
        });
      } else {
        throw e;
      }
    }

    return { success: true, auditEntry };
  } catch (err) {
    console.error("Error adding purchase audit note in Firestore:", err);
    throw err;
  }
};

export const addOrderAuditNote = addPurchaseAuditNote;
export const addOrderNote = (id, note) => addPurchaseAuditNote(id, note);

/**
 * Update purchase fulfillment / subscription status.
 */
export const updatePurchaseStatus = async (id, newStatus, collectionName = "purchases") => {
  try {
    let docRef = doc(firestore, collectionName, id);
    try {
      await updateDoc(docRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      if (collectionName === "purchases") {
        docRef = doc(firestore, "orders", id);
        await updateDoc(docRef, {
          status: newStatus,
          updatedAt: serverTimestamp(),
        });
      } else {
        throw e;
      }
    }
    return { success: true, id, status: newStatus };
  } catch (err) {
    console.error("Error updating purchase status in Firestore:", err);
    throw err;
  }
};

export default {
  getPurchases,
  getOrders,
  addPurchaseAuditNote,
  addOrderAuditNote,
  addOrderNote,
  updatePurchaseStatus,
  normalizePurchase,
};

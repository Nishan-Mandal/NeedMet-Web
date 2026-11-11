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
 * Normalizes payment / transaction documents from Firestore.
 */
export function normalizePayment(d, id = null) {
  const data = d?.data ? d.data() : (d || {});
  const docId = id || d?.id || data.id || data.paymentId || data.transactionId;

  // Amount parsing
  const rawAmount = data.amount ?? data.value ?? data.totalAmount ?? 0;
  const numAmount = typeof rawAmount === "number" ? rawAmount : (parseFloat(rawAmount) || 0);

  // Safe date parser
  const parseDate = (val) => {
    if (!val) return null;
    if (val.toDate && typeof val.toDate === "function") return val.toDate().toISOString();
    if (val.seconds) return new Date(val.seconds * 1000).toISOString();
    const dObj = new Date(val);
    return isNaN(dObj.getTime()) ? null : dObj.toISOString();
  };

  const createdAt = parseDate(data.createdAt) || parseDate(data.timestamp) || parseDate(data.date);
  const updatedAt = parseDate(data.updatedAt);

  // Status normalization
  const rawStatus = (data.status || "success").toLowerCase();
  let normalizedStatus = "success";
  if (["success", "paid", "captured", "completed"].includes(rawStatus)) {
    normalizedStatus = "success";
  } else if (["pending", "processing", "initiated", "created"].includes(rawStatus)) {
    normalizedStatus = "pending";
  } else if (["failed", "declined", "error"].includes(rawStatus)) {
    normalizedStatus = "failed";
  } else if (["refunded", "reversed"].includes(rawStatus)) {
    normalizedStatus = "refunded";
  }

  // Gateway & Method resolution
  const method = data.method || data.paymentMethod || data.paymentMode || (data.upi ? "UPI" : "Online Gateway");
  const gateway = data.gateway || data.provider || (data.razorpayPaymentId ? "Razorpay" : data.stripeId ? "Stripe" : "Direct Gateway");
  const gatewayRef = data.gatewayRef || data.razorpayPaymentId || data.stripePaymentId || data.transactionId || docId;

  return {
    id: docId,
    paymentId: docId,
    transactionId: data.transactionId || gatewayRef || docId,
    orderId: data.orderId || data.purchaseId || "",
    purchaseId: data.purchaseId || data.orderId || "",
    amount: numAmount,
    currency: data.currency || "INR",
    status: normalizedStatus,
    rawStatus,
    method,
    gateway,
    gatewayRef,
    payerName: data.payerName || data.userName || data.customerName || data.name || "Customer",
    payerEmail: data.payerEmail || data.userEmail || data.email || "",
    payerPhone: data.payerPhone || data.userPhone || data.phone || "",
    userId: data.userId || data.uid || "",
    createdAt,
    updatedAt,
    receiptUrl: data.receiptUrl || data.invoiceUrl || "",
    adminNotes: data.adminNotes || [],
    ...data,
  };
}

/**
 * Fetch payments & gateway transactions from Firestore 'payments' collection.
 */
export const getPayments = async ({
  page = 1,
  limit: pageSize = 20,
  search = "",
  status = "all",
  method = "all",
} = {}) => {
  if (isApiConfigured) {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
        search,
        status,
        method,
      });
      return await apiRequest(`/payments?${params.toString()}`, { method: "GET" });
    } catch (err) {
      if (err.status !== 404 && err.status !== 500) throw err;
    }
  }

  try {
    const snap = await getDocs(query(collection(firestore, "payments"), limit(250)));
    let payments = snap.docs.map((d) => normalizePayment(d, d.id));

    // Calculate metrics before filtering
    const metrics = {
      totalCount: payments.length,
      totalVolume: payments.reduce((acc, p) => acc + (p.status === "success" ? p.amount : 0), 0),
      successfulCount: payments.filter((p) => p.status === "success").length,
      pendingCount: payments.filter((p) => p.status === "pending").length,
      failedCount: payments.filter((p) => p.status === "failed").length,
      refundedCount: payments.filter((p) => p.status === "refunded").length,
    };

    // Filter by status
    if (status && status !== "all") {
      payments = payments.filter((p) => p.status === status || p.rawStatus === status);
    }

    // Filter by method
    if (method && method !== "all") {
      payments = payments.filter((p) => p.method?.toLowerCase() === method.toLowerCase());
    }

    // Search filter
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      payments = payments.filter(
        (p) =>
          (p.id && p.id.toLowerCase().includes(s)) ||
          (p.transactionId && p.transactionId.toLowerCase().includes(s)) ||
          (p.purchaseId && p.purchaseId.toLowerCase().includes(s)) ||
          (p.payerEmail && p.payerEmail.toLowerCase().includes(s)) ||
          (p.payerName && p.payerName.toLowerCase().includes(s)) ||
          (p.payerPhone && p.payerPhone.toLowerCase().includes(s)) ||
          (p.gatewayRef && p.gatewayRef.toLowerCase().includes(s))
      );
    }

    // Sort descending by date
    payments.sort((a, b) => {
      const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tB - tA;
    });

    const total = payments.length;
    const startIndex = (page - 1) * pageSize;
    const paginated = payments.slice(startIndex, startIndex + pageSize);

    return {
      success: true,
      payments: paginated,
      metrics,
      pagination: {
        total,
        page,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize) || 1,
      },
    };
  } catch (err) {
    console.error("Error loading payments from Firestore:", err);
    throw err;
  }
};

/**
 * Append an official administrative audit note to a payment record.
 */
export const addPaymentAuditNote = async (id, note) => {
  if (isApiConfigured) {
    try {
      return await apiRequest(`/payments/${id}/notes`, {
        method: "POST",
        body: JSON.stringify({ note }),
      });
    } catch (err) {
      if (err.status !== 404 && err.status !== 500) throw err;
    }
  }

  try {
    const docRef = doc(firestore, "payments", id);
    const auditEntry = {
      note: note.trim(),
      addedBy: auth.currentUser?.email || auth.currentUser?.uid || "Admin",
      addedAt: new Date().toISOString(),
    };
    await updateDoc(docRef, {
      adminNotes: arrayUnion(auditEntry),
      updatedAt: serverTimestamp(),
    });
    return { success: true, auditEntry };
  } catch (err) {
    console.error("Error adding payment audit note in Firestore:", err);
    throw err;
  }
};

/**
 * Update transaction settlement status (e.g., mark as refunded or success).
 */
export const updatePaymentStatus = async (id, newStatus) => {
  try {
    const docRef = doc(firestore, "payments", id);
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
    return { success: true, id, status: newStatus };
  } catch (err) {
    console.error("Error updating payment status in Firestore:", err);
    throw err;
  }
};

export default {
  getPayments,
  addPaymentAuditNote,
  updatePaymentStatus,
  normalizePayment,
};


import { firestore } from "../../firebase/firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Normalizes a Firestore cash_code document to support both legacy and production schemas.
 * Real Document Schema:
 * - amount: "1999" (string or number)
 * - code: "CASH-GTYHE3" (string)
 * - createdAt: Timestamp
 * - expiresAt: Timestamp
 * - generatedBy: "gPQyrRkSjpdywIrhUtsweKQz9cr1" (string)
 * - isUsed: false (boolean)
 * - ownerName: "Test Admin" (string)
 * - paymentId: "pay_CASH_2u3Jm7RfsgGnszkztmsx" (string)
 * - purchaseId: "purch_CASH_2u3Jm7RfsgGnszkztmsx" (string)
 * - usedAt: Timestamp (nullable)
 * - usedBy: string (nullable)
 */
export function normalizeCashCode(d, id = null) {
  const data = d?.data ? d.data() : (d || {});
  const docId = id || d?.id || data.id || data.code;

  // Resolve amount / value
  const rawAmount = data.amount ?? data.value ?? 0;
  const numAmount = typeof rawAmount === "number" ? rawAmount : (parseFloat(rawAmount) || 0);

  // Safe Date parsing helper for Firestore Timestamp objects or ISO strings
  const parseDate = (val) => {
    if (!val) return null;
    if (val.toDate && typeof val.toDate === "function") return val.toDate();
    if (val.seconds) return new Date(val.seconds * 1000);
    const dateObj = new Date(val);
    return isNaN(dateObj.getTime()) ? null : dateObj;
  };

  const createdAt = parseDate(data.createdAt);
  const expiresAt = parseDate(data.expiresAt);
  const usedAt = parseDate(data.usedAt);

  const now = new Date();
  const isRevoked = data.status === "revoked";
  const isUsed = Boolean(data.isUsed) || (Number(data.redemptionCount) >= Number(data.maxRedemptions || 1));
  const isExpired = Boolean(expiresAt && expiresAt < now);

  let computedStatus = "active";
  if (isRevoked) {
    computedStatus = "revoked";
  } else if (isUsed) {
    computedStatus = "redeemed";
  } else if (isExpired) {
    computedStatus = "expired";
  }

  const isAvailable = !isUsed && !isExpired && !isRevoked;

  return {
    id: docId,
    ...data,
    code: data.code || docId,
    amount: numAmount,
    value: numAmount,
    isUsed,
    isExpired,
    isRevoked,
    isAvailable,
    status: computedStatus,
    computedStatus,
    ownerName: data.ownerName || data.owner || "—",
    generatedBy: data.generatedBy || "—",
    paymentId: data.paymentId || null,
    purchaseId: data.purchaseId || null,
    usedBy: data.usedBy || null,
    usedAt: usedAt ? usedAt.toISOString() : null,
    usedAtDate: usedAt,
    createdAt: createdAt ? createdAt.toISOString() : null,
    createdAtDate: createdAt,
    expiresAt: expiresAt ? expiresAt.toISOString() : null,
    expiresAtDate: expiresAt,
  };
}

/**
 * Fetch cash codes directly from Firestore 'cash_codes' collection.
 */
export const getCashCodes = async (status = "all") => {
  try {
    const snap = await getDocs(collection(firestore, "cash_codes"));
    let codes = snap.docs.map((d) => normalizeCashCode(d, d.id));

    // Sort descending by createdAt
    codes.sort((a, b) => {
      const timeA = a.createdAtDate ? a.createdAtDate.getTime() : 0;
      const timeB = b.createdAtDate ? b.createdAtDate.getTime() : 0;
      return timeB - timeA;
    });

    if (status && status !== "all") {
      codes = codes.filter((c) => {
        if (status === "active") return c.isAvailable === true;
        if (status === "redeemed") return c.isUsed === true;
        if (status === "expired") return c.isExpired === true && !c.isUsed;
        if (status === "revoked") return c.isRevoked === true;
        return c.status === status || c.computedStatus === status;
      });
    }

    return {
      success: true,
      codes,
      cashCodes: codes,
    };
  } catch (err) {
    console.error("Error fetching cash codes from Firestore 'cash_codes' collection:", err);
    throw err;
  }
};

/**
 * Issue / create a new cash code directly in Firestore 'cash_codes' collection.
 */
export const createCashCode = async (codeData) => {
  try {
    const docRef = doc(collection(firestore, "cash_codes"));
    const validityDays = parseInt(codeData.validityDays, 10) || 30;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + validityDays);

    const numAmount = parseFloat(codeData.amount ?? codeData.value) || 0;

    const payload = {
      id: docRef.id,
      code: (codeData.code || "").toUpperCase().trim(),
      amount: String(numAmount), // Saved as string matching the Firestore production format
      value: numAmount,
      isUsed: false,
      ownerName: codeData.ownerName || "Admin",
      generatedBy: codeData.generatedBy || "admin",
      paymentId: codeData.paymentId || `pay_CASH_${Math.random().toString(36).substring(2, 12)}`,
      purchaseId: codeData.purchaseId || `purch_CASH_${Math.random().toString(36).substring(2, 12)}`,
      usedAt: null,
      usedBy: null,
      maxRedemptions: 1,
      redemptionCount: 0,
      status: "active",
      validityDays,
      notes: codeData.notes || "",
      createdAt: serverTimestamp(),
      expiresAt: expiry,
    };

    await setDoc(docRef, payload);
    const normalized = normalizeCashCode(payload, docRef.id);
    return { success: true, cashCode: normalized, code: normalized };
  } catch (err) {
    console.error("Error creating cash code in Firestore 'cash_codes' collection:", err);
    throw err;
  }
};

export const issueCashCode = createCashCode;

/**
 * Revoke an active cash code directly in Firestore 'cash_codes' collection.
 */
export const revokeCashCode = async (id, reason = "") => {
  try {
    const docRef = doc(firestore, "cash_codes", String(id));
    await updateDoc(docRef, {
      status: "revoked",
      revokeReason: reason,
      updatedAt: serverTimestamp(),
    });
    return { success: true, id, status: "revoked" };
  } catch (err) {
    console.error("Error revoking cash code in Firestore 'cash_codes' collection:", err);
    throw err;
  }
};

export default {
  normalizeCashCode,
  getCashCodes,
  createCashCode,
  issueCashCode,
  revokeCashCode,
};

/**
 * Utility functions for Admin Plans & Services Dashboard
 */

import {
  formatPlanDuration,
  getSafeDurationDays,
  formatPlanTitle,
  sanitizePlanVariant,
  isZeroOrEmptyDuration,
} from "../../../../../utils/duration.utils";

export {
  formatPlanDuration,
  getSafeDurationDays,
  formatPlanTitle,
  sanitizePlanVariant,
  isZeroOrEmptyDuration,
};

/**
 * Format timestamp or date string to readable Indian local format
 */
export function formatDate(dateVal) {
  if (!dateVal) return "—";
  try {
    const date = dateVal.toDate ? dateVal.toDate() : new Date(dateVal);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

/**
 * Extract the primary cover image URL from a service document
 */
export function getServiceCoverImage(service) {
  if (!service) return null;
  if (Array.isArray(service.imageUrl) && service.imageUrl.length > 0) {
    return service.imageUrl[0];
  }
  return service.imageUrl || service.image || null;
}

/**
 * Compute the min and max price across all child duration plans
 */
export function calculatePriceRange(service) {
  if (!service) return { minPrice: 0, maxPrice: 0, isRange: false };
  const subPlans = service.plans || service.variants || [];

  const prices = subPlans
    .map((v) => Number(v.finalPrice) || Number(v.price) || 0)
    .filter((p) => p > 0);

  const fallbackPrice = Number(service.finalPrice) || Number(service.price) || 0;
  const minPrice = prices.length > 0 ? Math.min(...prices) : fallbackPrice;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : minPrice;

  return {
    minPrice,
    maxPrice,
    isRange: minPrice !== maxPrice,
  };
}

/**
 * Calculate dashboard summary metrics
 */
export function calculateServiceMetrics(plans = []) {
  const totalServices = plans.length;
  let totalPlans = 0;
  let published = 0;
  let draft = 0;
  let archived = 0;

  plans.forEach((p) => {
    const subPlans = p.plans || p.variants || [];
    totalPlans += subPlans.length > 0 ? subPlans.length : 1;
    if (p.status === "published") {
      published++;
    } else if (p.status === "archived") {
      archived++;
    } else {
      draft++;
    }
  });

  return { totalServices, totalPlans, published, draft, archived };
}

/**
 * Determine aggregate payment mode status across a service and its child duration plans
 */
export function getServicePaymentModeSummary(service) {
  if (!service) return { label: "Full Payment", isEmiEligible: false, isEmiOnly: false };
  const subPlans = service.plans || service.variants || [];

  if (subPlans.length > 0) {
    const anyEmi = subPlans.some(
      (p) =>
        p.paymentOptions === "BOTH" ||
        p.paymentOptions === "EMI" ||
        Boolean(p.emiConfig?.enabled)
    );
    const allEmi = subPlans.every((p) => p.paymentOptions === "EMI");
    const allFull = subPlans.every((p) => p.paymentOptions === "FULL");

    if (allEmi) {
      return { label: "EMI Only", isEmiEligible: true, isEmiOnly: true };
    }
    if (anyEmi) {
      return { label: "Full & EMI", isEmiEligible: true, isEmiOnly: false };
    }
    if (allFull) {
      return { label: "Full Payment", isEmiEligible: false, isEmiOnly: false };
    }
  }

  const isEmi =
    service.paymentOptions === "BOTH" ||
    service.paymentOptions === "EMI" ||
    Boolean(service.pricing?.emiAvailable) ||
    Boolean(service.emiConfig?.enabled);

  if (service.paymentOptions === "EMI") {
    return { label: "EMI Only", isEmiEligible: true, isEmiOnly: true };
  }
  if (isEmi) {
    return { label: "Full & EMI", isEmiEligible: true, isEmiOnly: false };
  }

  return { label: "Full Payment", isEmiEligible: false, isEmiOnly: false };
}

/**
 * Extract clean, human-readable EMI schedule representation for a child plan tier
 */
export function formatEmiScheduleSummary(sub) {
  if (!sub) return { isEmi: false, shortText: "—", text: "—" };

  const isEmi =
    sub.paymentOptions === "BOTH" ||
    sub.paymentOptions === "EMI" ||
    Boolean(sub.emiConfig?.enabled);

  if (!isEmi) {
    return { isEmi: false, shortText: "—", text: "Full payment only" };
  }

  const upfrontType =
    sub.upfrontType || sub.emiConfig?.upfrontType || "percentage";

  const rawUpfrontValue =
    sub.upfrontValue !== undefined && sub.upfrontValue !== null
      ? sub.upfrontValue
      : sub.emiConfig?.upfrontValue;

  const upfrontValue =
    rawUpfrontValue !== undefined && rawUpfrontValue !== null && rawUpfrontValue !== ""
      ? Number(rawUpfrontValue)
      : 15;

  const durationDays = getSafeDurationDays(sub);
  const autoCycles = Math.max(Math.ceil((durationDays - 5) / 30), 1);

  const rawCycles =
    sub.totalCycles !== undefined && sub.totalCycles !== null
      ? sub.totalCycles
      : sub.emiConfig?.totalCycles;

  const cycles = Number(rawCycles) || autoCycles;

  let upfrontDisplay = "";
  if (upfrontType === "percentage") {
    upfrontDisplay = `${upfrontValue}%`;
  } else {
    upfrontDisplay = `₹${upfrontValue.toLocaleString("en-IN")}`;
  }

  const emiAmt = sub.emiAmount || sub.emiConfig?.emiAmount;

  return {
    isEmi: true,
    upfrontDisplay,
    cycles,
    emiAmt,
    shortText: `${upfrontDisplay} down • ${cycles} mo`,
    text: `${upfrontDisplay} down payment • ${cycles} monthly cycles${
      emiAmt ? ` (₹${Number(emiAmt).toLocaleString("en-IN")}/mo)` : ""
    }`,
  };
}

/**
 * Filter services by status, payment method, and search text
 */
export function filterServicesAndPlans(plans = [], { statusFilter = "all", paymentFilter = "all", searchQuery = "" } = {}) {
  const q = (searchQuery || "").trim().toLowerCase();

  return plans.filter((p) => {
    // 1. Status Filter
    if (statusFilter !== "all" && p.status !== statusFilter) return false;

    // 2. Payment Filter (checks top level and child tiers)
    if (paymentFilter !== "all") {
      const summary = getServicePaymentModeSummary(p);
      if (paymentFilter === "EMI" && !summary.isEmiEligible) return false;
      if (paymentFilter === "FULL" && summary.isEmiOnly) return false;
      if (paymentFilter === "BOTH" && !summary.isEmiEligible) return false;
    }

    // 3. Search Query
    if (q) {
      const nameMatch = (p.name || "").toLowerCase().includes(q);
      const serviceMatch = (p.serviceName || "").toLowerCase().includes(q);
      const creatorMatch = (p.creatorEmail || p.createdBy || "").toLowerCase().includes(q);
      const categoryMatch = (p.category || "").toLowerCase().includes(q);
      const subPlans = p.plans || p.variants || [];
      const plansMatch = subPlans.some(
        (sub) =>
          (sub.name || "").toLowerCase().includes(q) ||
          (sub.duration || "").toLowerCase().includes(q) ||
          formatPlanDuration(sub).toLowerCase().includes(q)
      );

      if (!nameMatch && !serviceMatch && !creatorMatch && !categoryMatch && !plansMatch) {
        return false;
      }
    }

    return true;
  });
}

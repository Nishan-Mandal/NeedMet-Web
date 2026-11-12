import {
  formatPlanDuration,
  getSafeDurationDays,
  formatPlanTitle,
  sanitizePlanVariant,
  isZeroOrEmptyDuration,
} from "../../../../../utils/duration.utils.js";

export {
  formatPlanDuration,
  getSafeDurationDays,
  formatPlanTitle,
  sanitizePlanVariant,
  isZeroOrEmptyDuration,
};

/**
 * Preset duration configurations for quick 1-click addition of plans / duration options
 */
export const DURATION_PRESETS = [
  {
    key: "1m",
    label: "1 Month",
    name: "Standard-1M",
    duration: "1 Month",
    durationDays: 30,
    planType: "1 Month",
    tag: "Recommended",
    defaultCycles: 1,
    defaultPrice: 5499,
  },
  {
    key: "3m",
    label: "3 Months",
    name: "Starter-3M",
    duration: "3 Months",
    durationDays: 92,
    planType: "3 Months",
    tag: "Popular",
    defaultCycles: 3,
    defaultPrice: 3999,
  },
  {
    key: "6m",
    label: "6 Months",
    name: "Growth-6M",
    duration: "6 Months",
    durationDays: 184,
    planType: "6 Months",
    tag: "Best Value",
    defaultCycles: 6,
    defaultPrice: 6999,
  },
  {
    key: "12m",
    label: "12 Months",
    name: "Scale-12M",
    duration: "12 Months",
    durationDays: 365,
    planType: "1 Year",
    tag: "Saver",
    defaultCycles: 12,
    defaultPrice: 12999,
  },
];

/**
 * Creates a plan object (belonging to service.plans) with defaults and safe EMI cycles.
 */
export function createPlan(config = {}) {
  const duration = formatPlanDuration(config);
  const durationDays = getSafeDurationDays(config);
  const bufferDays = 5;
  const autoCycles = Math.max(Math.ceil((durationDays - bufferDays) / 30), 1);
  const name = formatPlanTitle(config) || `${duration} Plan`;

  return {
    id: config.id || config.planId || `plan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    planId: config.planId || config.id || "",
    name: name,
    duration: duration,
    durationDays: durationDays,
    planType: config.planType && !isZeroOrEmptyDuration(config.planType) ? config.planType : duration,
    tag: config.tag !== undefined ? config.tag : "Popular",
    description: config.description || "",
    price: Number(config.price) || 3999,
    discountAmount: Number(config.discountAmount) || 0,
    paymentOptions: config.paymentOptions || "BOTH", // "FULL", "EMI", "BOTH"
    upfrontType: config.upfrontType || config.emiConfig?.upfrontType || "percentage", // "percentage" | "fixed"
    upfrontValue: Number(config.upfrontValue ?? config.emiConfig?.upfrontValue ?? 15),
    totalCycles: Number(config.totalCycles ?? config.emiConfig?.totalCycles ?? autoCycles),
    billingDay: Number(config.billingDay ?? config.emiConfig?.billingDay ?? 9),
    firstDebitDays: Number(config.firstDebitDays ?? config.emiConfig?.firstDebitDays ?? 30),
    features: Array.isArray(config.features)
      ? config.features.map((f) => (typeof f === "string" ? { icon: "check_circle", title: f, desc: "" } : { icon: f.icon || "check_circle", title: f.title || f.name || "", desc: f.desc || f.description || "" }))
      : [],
    isActive: config.isActive !== undefined ? Boolean(config.isActive) : true,
  };
}

// Alias for backward compatibility
export const createVariant = createPlan;

/**
 * Default empty form state for a Service with duration-wise plans (3M & 6M default)
 */
export const DEFAULT_PLAN_FORM = {
  // Service root attributes
  id: "",
  serviceId: "",
  title: "",
  name: "",
  category: "Digital Marketing",
  badge: "Popular",
  tag: "Popular",
  description: "",
  images: [],
  status: "published", // "published", "draft", "archived"
  isActive: true,
  notes: "",
  availabilityStart: "",
  availabilityEnd: "",
  serviceStart: "",
  selectedPlanIndex: 0,
  selectedVariantIndex: 0,
  // Plans array belonging to this service: service.plans = [ 3M, 6M ]
  plans: [
    createPlan({
      name: "Starter-3M",
      duration: "3 Months",
      durationDays: 92,
      planType: "3 Months",
      tag: "Popular",
      price: 3999,
      discountAmount: 0,
      paymentOptions: "BOTH",
      upfrontType: "percentage",
      upfrontValue: 15,
      totalCycles: 3,
      features: [
        {
          icon: "account_circle",
          title: "Profile Setup & Optimization",
          desc: "Complete professional profile setup and enhancement.",
        },
        {
          icon: "analytics",
          title: "Weekly Performance Reports",
          desc: "Analytics and key growth metrics delivered weekly.",
        },
        {
          icon: "post_add",
          title: "Regular Content Posting",
          desc: "Consistent engaging social media posts.",
        },
      ],
    }),
    createPlan({
      name: "Growth-6M",
      duration: "6 Months",
      durationDays: 184,
      planType: "6 Months",
      tag: "Best Value",
      price: 6999,
      discountAmount: 0,
      paymentOptions: "BOTH",
      upfrontType: "percentage",
      upfrontValue: 15,
      totalCycles: 6,
      features: [
        {
          icon: "account_circle",
          title: "Profile Setup & Optimization",
          desc: "Complete professional profile setup and enhancement.",
        },
        {
          icon: "analytics",
          title: "Weekly Performance Reports",
          desc: "Analytics and key growth metrics delivered weekly.",
        },
        {
          icon: "post_add",
          title: "Regular Content Posting",
          desc: "Consistent engaging social media posts.",
        },
        {
          icon: "brush",
          title: "Custom Creative Designs",
          desc: "Custom graphics, banner designs and reels.",
        },
      ],
    }),
  ],
};

// Ensure variants references plans for backward compatibility in components
DEFAULT_PLAN_FORM.variants = DEFAULT_PLAN_FORM.plans;

/**
 * Calculates pricing, upfronts, discounts, and EMI installments for a single variant.
 */
export function calculateVariantPricing(variant = {}) {
  const rawPrice = Number(variant.price) || 0;
  const discount = Number(variant.discountAmount) || 0;
  const finalPrice = Math.max(Math.round((rawPrice - discount) * 100) / 100, 0);

  let upfrontAmount = 0;
  if (variant.upfrontType === "percentage") {
    const pct = Math.min(Math.max(Number(variant.upfrontValue) || 0, 1), 100);
    upfrontAmount = Math.round(((finalPrice * pct) / 100) * 100) / 100;
  } else {
    upfrontAmount = Math.min(Math.max(Number(variant.upfrontValue) || 0, 1), finalPrice);
  }

  const remainingAmount = Math.max(
    Math.round((finalPrice - upfrontAmount) * 100) / 100,
    0
  );
  const cycles = Math.max(Number(variant.totalCycles) || 1, 1);
  const emiAmount = Math.round((remainingAmount / cycles) * 100) / 100;
  const discountPercent =
    rawPrice > 0 ? Math.round((discount / rawPrice) * 100) : 0;

  return {
    finalPrice,
    upfrontAmount,
    remainingAmount,
    cycles,
    emiAmount,
    discountPercent,
  };
}

/**
 * Normalizes an existing Firestore service or plan record into the form state.
 * Supports both standard service documents (with plans: []) and legacy plan records.
 */
export function normalizeExistingPlan(existingRecord) {
  if (!existingRecord) return null;

  // 1. Normalize images
  let images = [];
  if (Array.isArray(existingRecord.imageUrl)) {
    images = existingRecord.imageUrl.filter(
      (u) => typeof u === "string" && u.trim().length > 0
    );
  } else if (
    typeof existingRecord.imageUrl === "string" &&
    existingRecord.imageUrl.trim()
  ) {
    images = [existingRecord.imageUrl.trim()];
  } else if (existingRecord.image) {
    images = [existingRecord.image];
  }

  // 2. Extract plans array: checks plans, variants, or synthesizes from flat record
  const rawPlans =
    Array.isArray(existingRecord.plans) && existingRecord.plans.length > 0
      ? existingRecord.plans
      : Array.isArray(existingRecord.variants) && existingRecord.variants.length > 0
      ? existingRecord.variants
      : [existingRecord];

  const plans = rawPlans.map((p, idx) => {
    let featList = [];
    if (Array.isArray(p.features)) {
      featList = p.features.map((f) => {
        if (typeof f === "string") {
          return { icon: "check_circle", title: f, desc: "" };
        }
        return {
          icon: f.icon || "check_circle",
          title: f.title || f.name || "Deliverable",
          desc: f.desc || f.description || "",
        };
      });
    }

    const durationDays = getSafeDurationDays(p);
    const duration = formatPlanDuration(p);
    const name = formatPlanTitle(p) || `${duration} Plan`;

    return createPlan({
      id: p.planId || p.id || `plan-${idx + 1}`,
      planId: p.planId || p.id || "",
      name: name,
      duration: duration,
      durationDays: durationDays,
      planType: p.planType && !isZeroOrEmptyDuration(p.planType) ? p.planType : duration,
      tag: p.tag !== undefined ? p.tag : (idx === 0 ? "Popular" : idx === 1 ? "Best Value" : ""),
      description: p.description || "",
      price: Number(p.price) || 0,
      discountAmount: Number(p.discountAmount) || 0,
      paymentOptions: p.paymentOptions || "BOTH",
      upfrontType: p.upfrontType || p.emiConfig?.upfrontType || "percentage",
      upfrontValue: p.upfrontValue !== undefined ? Number(p.upfrontValue) : (p.emiConfig?.upfrontValue !== undefined ? Number(p.emiConfig.upfrontValue) : 15),
      totalCycles: p.totalCycles !== undefined ? Number(p.totalCycles) : (p.emiConfig?.totalCycles !== undefined ? Number(p.emiConfig.totalCycles) : Math.max(Math.ceil((durationDays - 5) / 30), 1)),
      billingDay: p.billingDay !== undefined ? Number(p.billingDay) : (Number(p.emiConfig?.billingDay) || 9),
      firstDebitDays: p.firstDebitDays !== undefined ? Number(p.firstDebitDays) : (Number(p.emiConfig?.firstDebitDays) || 30),
      features: featList,
      isActive: p.isActive !== undefined ? Boolean(p.isActive) : true,
    });
  });

  const title = existingRecord.title || existingRecord.name || "";
  const badge = existingRecord.badge || existingRecord.tag || (plans[0]?.tag || "Popular");
  const serviceId = existingRecord.id || existingRecord.serviceId || existingRecord.planId || "";

  const normalizedForm = {
    id: serviceId,
    serviceId: serviceId,
    planId: serviceId,
    title: title,
    name: title,
    description: existingRecord.description || "",
    category: existingRecord.category || "Digital Marketing",
    badge: badge,
    tag: badge,
    images,
    status: existingRecord.status || "published",
    isActive:
      existingRecord.isActive !== undefined
        ? Boolean(existingRecord.isActive)
        : existingRecord.status === "published",
    notes: existingRecord.notes || "",
    availabilityStart: existingRecord.datesConfig?.availabilityStart || "",
    availabilityEnd: existingRecord.datesConfig?.availabilityEnd || "",
    serviceStart: existingRecord.datesConfig?.serviceStart || "",
    plans: plans.length > 0 ? plans : DEFAULT_PLAN_FORM.plans,
    variants: plans.length > 0 ? plans : DEFAULT_PLAN_FORM.plans,
    selectedPlanIndex:
      existingRecord.selectedVariantIndex !== undefined &&
      existingRecord.selectedVariantIndex < plans.length
        ? existingRecord.selectedVariantIndex
        : 0,
    selectedVariantIndex:
      existingRecord.selectedVariantIndex !== undefined &&
      existingRecord.selectedVariantIndex < plans.length
        ? existingRecord.selectedVariantIndex
        : 0,
  };

  const creatorInfo = {
    createdBy: existingRecord.createdBy,
    creatorEmail: existingRecord.creatorEmail,
    createdAt: existingRecord.createdAt,
    updatedBy: existingRecord.updatedBy,
    updatedAt: existingRecord.updatedAt,
  };

  return { normalizedForm, creatorInfo };
}

/**
 * Clones an existing plan/service record for form prefill.
 * Copies all configurable fields while stripping system IDs, runtime/transaction data, and creator metadata.
 */
export function clonePlanForForm(sourceRecord) {
  if (!sourceRecord) return { formData: DEFAULT_PLAN_FORM, sourceTitle: "" };

  const sourceTitle = (sourceRecord.title || sourceRecord.name || "").trim();
  const clonedTitle = sourceTitle ? `${sourceTitle} (Copy)` : "Cloned Service";

  // 1. Extract cover images safely
  let images = [];
  if (Array.isArray(sourceRecord.imageUrl)) {
    images = sourceRecord.imageUrl.filter(Boolean);
  } else if (Array.isArray(sourceRecord.images)) {
    images = sourceRecord.images.filter(Boolean);
  } else if (typeof sourceRecord.imageUrl === "string" && sourceRecord.imageUrl.trim()) {
    images = [sourceRecord.imageUrl.trim()];
  } else if (sourceRecord.image) {
    images = [sourceRecord.image];
  }

  // 2. Extract and sanitize duration plans, generating new unique IDs for each
  const rawPlans =
    Array.isArray(sourceRecord.plans) && sourceRecord.plans.length > 0
      ? sourceRecord.plans
      : Array.isArray(sourceRecord.variants) && sourceRecord.variants.length > 0
      ? sourceRecord.variants
      : [sourceRecord];

  const clonedPlans = rawPlans.map((p, idx) => {
    let featList = [];
    if (Array.isArray(p.features)) {
      featList = p.features.map((f) => {
        if (typeof f === "string") {
          return { icon: "check_circle", title: f, desc: "" };
        }
        return {
          icon: f.icon || "check_circle",
          title: f.title || f.name || "Deliverable",
          desc: f.desc || f.description || "",
        };
      });
    }

    const durationDays = getSafeDurationDays(p);
    const duration = formatPlanDuration(p);
    const name = formatPlanTitle(p) || `${duration} Plan`;
    const newUniquePlanId = `plan-${Date.now()}-${idx + 1}-${Math.random().toString(36).substring(2, 6)}`;

    return createPlan({
      id: newUniquePlanId,
      planId: newUniquePlanId,
      name: name,
      duration: duration,
      durationDays: durationDays,
      planType: p.planType && !isZeroOrEmptyDuration(p.planType) ? p.planType : duration,
      tag: p.tag !== undefined ? p.tag : (idx === 0 ? "Popular" : idx === 1 ? "Best Value" : ""),
      description: p.description || "",
      price: Number(p.price) || 0,
      discountAmount: Number(p.discountAmount) || 0,
      paymentOptions: p.paymentOptions || "BOTH",
      upfrontType: p.upfrontType || p.emiConfig?.upfrontType || "percentage",
      upfrontValue: p.upfrontValue !== undefined ? Number(p.upfrontValue) : (p.emiConfig?.upfrontValue !== undefined ? Number(p.emiConfig.upfrontValue) : 15),
      totalCycles: p.totalCycles !== undefined ? Number(p.totalCycles) : (p.emiConfig?.totalCycles !== undefined ? Number(p.emiConfig.totalCycles) : Math.max(Math.ceil((durationDays - 5) / 30), 1)),
      billingDay: p.billingDay !== undefined ? Number(p.billingDay) : (Number(p.emiConfig?.billingDay) || 9),
      firstDebitDays: p.firstDebitDays !== undefined ? Number(p.firstDebitDays) : (Number(p.emiConfig?.firstDebitDays) || 30),
      features: featList,
      isActive: p.isActive !== undefined ? Boolean(p.isActive) : true,
    });
  });

  const badge = sourceRecord.badge || sourceRecord.tag || (clonedPlans[0]?.tag || "Popular");

  const formData = {
    // Identity fields cleared so it cannot overwrite original
    id: "",
    serviceId: "",
    planId: "",
    title: clonedTitle,
    name: clonedTitle,
    description: sourceRecord.description || "",
    category: sourceRecord.category || "Digital Marketing",
    badge: badge,
    tag: badge,
    images: [...images],
    status: sourceRecord.status || "draft",
    isActive: sourceRecord.isActive !== undefined ? Boolean(sourceRecord.isActive) : true,
    notes: sourceRecord.notes || "",
    availabilityStart: sourceRecord.datesConfig?.availabilityStart || "",
    availabilityEnd: sourceRecord.datesConfig?.availabilityEnd || "",
    serviceStart: sourceRecord.datesConfig?.serviceStart || "",
    plans: clonedPlans.length > 0 ? clonedPlans : DEFAULT_PLAN_FORM.plans,
    variants: clonedPlans.length > 0 ? clonedPlans : DEFAULT_PLAN_FORM.plans,
    selectedPlanIndex: 0,
    selectedVariantIndex: 0,
  };

  return { formData, sourceTitle };
}

/**
 * Parses raw newline-delimited text into feature objects.
 */
export function parseBulkFeatures(bulkText) {
  const lines = (bulkText || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return lines.map((line) => {
    if (line.includes(":")) {
      const [title, ...descParts] = line.split(":");
      return {
        icon: "check_circle",
        title: title.trim(),
        desc: descParts.join(":").trim(),
      };
    }
    return { icon: "check_circle", title: line, desc: "" };
  });
}

/**
 * Constructs the clean Firestore Service payload (with nested service.plans).
 * Retains both `plans` and `variants` for 100% backward and forward compatibility.
 */
export function buildPlanPayload(formData, { isEditMode = false } = {}) {
  const rawPlans = formData.plans || formData.variants || [];
  const serviceTitle = (formData.title || formData.name || "").trim();

  // In edit mode with an existing ID, preserve it. For new plans and clones, generate a unique ID with timestamp.
  let slugId = "";
  if (isEditMode && (formData.id || formData.serviceId || formData.planId)) {
    slugId = (formData.id || formData.serviceId || formData.planId)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "");
  }
  if (!slugId) {
    const baseSlug =
      serviceTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "service";
    slugId = `${baseSlug}-${Date.now().toString().slice(-6)}`;
  }

  const plans = rawPlans.map((p, idx) => {
    const calc = calculateVariantPricing(p);
    const durationDays = getSafeDurationDays(p);
    const duration = formatPlanDuration(p);
    const name = formatPlanTitle(p) || `${duration} Plan`;
    const planId =
      isEditMode && p.planId?.trim()
        ? p.planId.trim()
        : `${slugId}-plan-${idx + 1}-${durationDays}d`;

    return {
      id: planId,
      planId: planId,
      name: name,
      duration: duration,
      durationDays: durationDays,
      planType: p.planType && !isZeroOrEmptyDuration(p.planType) ? p.planType : duration,
      tag: p.tag?.trim() || "",
      description: p.description?.trim() || "",
      price: Number(p.price) || 0,
      discountAmount: Number(p.discountAmount) || 0,
      finalPrice: calc.finalPrice,
      currency: "INR",
      paymentOptions: p.paymentOptions || "BOTH",
      upfrontType: p.upfrontType || "percentage",
      upfrontValue: Number(p.upfrontValue) || 15,
      upfrontAmount: calc.upfrontAmount,
      totalCycles: calc.cycles,
      billingDay: Number(p.billingDay ?? p.emiConfig?.billingDay ?? 9),
      emiAmount: calc.emiAmount,
      remainingAmount: calc.remainingAmount,
      emiConfig: {
        enabled: p.paymentOptions === "EMI" || p.paymentOptions === "BOTH",
        upfrontType: p.upfrontType || "percentage",
        upfrontValue: Number(p.upfrontValue) || 15,
        upfrontAmount: calc.upfrontAmount,
        remainingAmount: calc.remainingAmount,
        totalCycles: calc.cycles,
        billingDay: Number(p.billingDay ?? p.emiConfig?.billingDay ?? 9),
        emiAmount: calc.emiAmount,
        billingInterval: "monthly",
        firstDebitDays: Number(p.firstDebitDays) || 30,
      },
      features: (p.features || []).filter((f) => f.title?.trim().length > 0),
      isActive: Boolean(p.isActive),
    };
  });

  // Primary plan for top-level storefront summaries
  const primaryPlan = plans[0] || {};
  const primaryCalc = primaryPlan.emiConfig || {};
  const badge = (formData.badge || formData.tag || primaryPlan.tag || "POPULAR").trim();
  const category = (formData.category || "Digital Marketing").trim();

  // Aggregate payment capabilities across all duration plans
  const anyEmi = plans.some((p) => p.paymentOptions === "BOTH" || p.paymentOptions === "EMI");
  const allEmi = plans.length > 0 && plans.every((p) => p.paymentOptions === "EMI");
  const rootPaymentOptions = allEmi ? "EMI" : anyEmi ? "BOTH" : "FULL";

  return {
    id: slugId,
    serviceId: slugId,
    planId: slugId,
    title: serviceTitle,
    name: serviceTitle,
    description: (formData.description || "").trim(),
    category: category,
    categoryId: category.toLowerCase().replace(/ /g, "-"),
    badge: badge,
    tag: badge,
    imageUrl: formData.images || [],
    image: (formData.images && formData.images[0]) || "",
    status: formData.status || "published",
    isActive: Boolean(formData.isActive),
    notes: (formData.notes || "").trim(),
    
    // Core Service Architecture: Under Service, there is plans: []
    plans: plans,
    variants: plans, // Backward compatibility

    // Storefront pricing summary (used by Home filter, sort & card)
    pricing: {
      price: primaryPlan.finalPrice || primaryPlan.price || 0,
      regularPrice: primaryPlan.price || 0,
      discount: primaryPlan.discountAmount || 0,
      emiAvailable: anyEmi,
    },

    // Dates configuration
    datesConfig: {
      availabilityStart: formData.availabilityStart || null,
      availabilityEnd: formData.availabilityEnd || null,
      serviceStart: formData.serviceStart || null,
      serviceDurationDays: primaryPlan.durationDays || 30,
    },

    // Top-level flat compatibility fields for legacy readers
    price: primaryPlan.price || 0,
    discountAmount: primaryPlan.discountAmount || 0,
    finalPrice: primaryPlan.finalPrice || 0,
    currency: "INR",
    duration: primaryPlan.duration || "3 Months",
    durationDays: primaryPlan.durationDays || 92,
    planType: primaryPlan.planType || "3 Months",
    paymentOptions: rootPaymentOptions,
    billingDay: Number(primaryPlan.billingDay ?? primaryCalc.billingDay ?? 9),
    emiConfig: {
      enabled: anyEmi,
      upfrontType: primaryCalc.upfrontType || "percentage",
      upfrontValue: primaryCalc.upfrontValue || 15,
      upfrontAmount: primaryCalc.upfrontAmount || 0,
      remainingAmount: primaryCalc.remainingAmount || 0,
      totalCycles: primaryCalc.totalCycles || 1,
      billingDay: Number(primaryPlan.billingDay ?? primaryCalc.billingDay ?? 9),
      emiAmount: primaryCalc.emiAmount || 0,
      billingInterval: "monthly",
      firstDebitDays: 30,
    },
    features: primaryPlan.features || [],
  };
}

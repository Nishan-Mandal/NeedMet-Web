import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import {
  formatPlanDuration,
  getSafeDurationDays,
  formatPlanTitle,
  sanitizePlanVariant,
  isZeroOrEmptyDuration,
} from "../utils/duration.utils";

export const fetchServices = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "services"));
    const services = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const rawPlans = data.plans || data.variants || [];
      const cleanPlans = rawPlans.map((p, idx) => sanitizePlanVariant(p, `Option ${idx + 1}`));
      services.push({
        id: doc.id,
        ...data,
        plans: cleanPlans,
        variants: cleanPlans,
      });
    });
    return services;
  } catch (error) {
    console.error("Error fetching services: ", error);
    return [];
  }
};

export const fetchServiceById = async (serviceId) => {
  try {
    const docRef = doc(db, "services", String(serviceId));
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const rawPlans = data.plans || data.variants || [];
      const cleanPlans = rawPlans.map((p, idx) => sanitizePlanVariant(p, `Option ${idx + 1}`));
      return {
        id: docSnap.id,
        ...data,
        plans: cleanPlans,
        variants: cleanPlans,
      };
    } else {
      console.log("No such service!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching service: ", error);
    return null;
  }
};

export const fetchReviews = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "reviews"));
    const reviews = [];
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews: ", error);
    return [];
  }
};

export const fetchPlans = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "services"));
    const services = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const rawPlans = data.plans || data.variants || [];
      const cleanPlans = rawPlans.map((p, idx) => sanitizePlanVariant(p, `Option ${idx + 1}`));
      services.push({
        id: doc.id,
        ...data,
        plans: cleanPlans,
        variants: cleanPlans,
      });
    });
    return services;
  } catch (error) {
    console.error("Error fetching plans from services: ", error);
    return [];
  }
};

export const fetchPlanById = async (planId) => {
  try {
    const idStr = String(planId);

    // 1. Direct document lookup in 'services' collection
    const serviceRef = doc(db, "services", idStr);
    const serviceSnap = await getDoc(serviceRef);
    if (serviceSnap.exists()) {
      const serviceData = serviceSnap.data();
      const rawPlans = serviceData.plans || serviceData.variants || [];
      const plans = rawPlans.map((p, idx) => sanitizePlanVariant(p, `Option ${idx + 1}`));
      return {
        id: serviceSnap.id,
        serviceId: serviceSnap.id,
        planId: serviceSnap.id,
        name: serviceData.title || serviceData.name || "Service Plan",
        title: serviceData.title || serviceData.name || "Service Plan",
        description: serviceData.description || "",
        category: serviceData.category || "Digital Marketing",
        tag: serviceData.badge || serviceData.tag || (plans[0]?.tag || "Popular"),
        badge: serviceData.badge || serviceData.tag || (plans[0]?.tag || "POPULAR"),
        imageUrl: serviceData.imageUrl
          ? (Array.isArray(serviceData.imageUrl) ? serviceData.imageUrl : [serviceData.imageUrl])
          : (serviceData.image ? [serviceData.image] : []),
        status: serviceData.status || "published",
        isActive: serviceData.isActive !== undefined ? Boolean(serviceData.isActive) : true,
        plans: plans,
        variants: plans,
        datesConfig: serviceData.datesConfig || null,
        notes: serviceData.notes || "",
        createdBy: serviceData.createdBy,
        creatorEmail: serviceData.creatorEmail,
        createdAt: serviceData.createdAt,
        updatedBy: serviceData.updatedBy,
        updatedAt: serviceData.updatedAt,
        source: "services",
      };
    }

    // 2. Fallback: Search all service plans in 'services' collection by variant sub-planId
    const servicesSnapshot = await getDocs(collection(db, "services"));
    for (const sDoc of servicesSnapshot.docs) {
      const serviceData = sDoc.data();
      const serviceId = sDoc.id;

      const rawPlans = serviceData.plans || serviceData.variants || [];
      const plans = rawPlans.map((p, idx) => sanitizePlanVariant(p, `Option ${idx + 1}`));
      const foundIndex = plans.findIndex((p) => p.planId === planId || p.id === planId);
      if (foundIndex !== -1) {
        const found = plans[foundIndex];
        return {
          id: serviceId,
          serviceId: serviceId,
          planId: found.planId || planId,
          name: serviceData.title || found.name || "Service Plan",
          title: serviceData.title || found.name || "Service Plan",
          description: found.description || serviceData.description || "",
          category: serviceData.category || "Digital Marketing",
          tag: found.tag || serviceData.badge || "Popular",
          badge: serviceData.badge || "POPULAR",
          imageUrl: found.imageUrl && found.imageUrl.length > 0 ? found.imageUrl : (serviceData.imageUrl ? (Array.isArray(serviceData.imageUrl) ? serviceData.imageUrl : [serviceData.imageUrl]) : []),
          status: found.status || serviceData.status || "published",
          isActive: found.isActive !== undefined ? Boolean(found.isActive) : true,
          variants: plans,
          plans: plans,
          selectedVariantIndex: foundIndex,
          source: "services",
        };
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching plan by ID: ", error);
    return null;
  }
};

export const fetchCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "service-categories"));
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push(doc.data().name || doc.id);
    });
    const uniqueCategories = [...new Set(categories)];
    return ["All", ...uniqueCategories];
  } catch (error) {
    console.error("Error fetching categories: ", error);
    return ["All", "Marketing", "Social Media", "Website", "Branding", "SEO"];
  }
};

// ===============================================================
// ADMIN PLAN MANAGEMENT
// ===============================================================

/**
 * Fetches ALL plans for administration from 'services' collection ONLY.
 */
export const fetchAdminPlans = async () => {
  try {
    const servicesSnapshot = await getDocs(collection(db, "services"));
    const servicePlans = [];

    servicesSnapshot.forEach((sDoc) => {
      const serviceData = sDoc.data();
      const serviceId = sDoc.id;

      const rawPlans = serviceData.plans || serviceData.variants || [];
      const variants = rawPlans.map((p, idx) => sanitizePlanVariant(p, `Option ${idx + 1}`));
      const primaryVariant = variants[0] || {};

      servicePlans.push({
        id: serviceId,
        planId: serviceId,
        name: serviceData.title || serviceData.name || "Service Plan",
        title: serviceData.title || serviceData.name || "Service Plan",
        description: serviceData.description || "",
        serviceId: serviceId,
        serviceName: serviceData.title || serviceData.name || "NeedMet Digital",
        category: serviceData.category || "Digital Marketing",
        status: serviceData.status || "published",
        source: "services",
        imageUrl: serviceData.imageUrl
          ? (Array.isArray(serviceData.imageUrl) ? serviceData.imageUrl : [serviceData.imageUrl])
          : (serviceData.image ? [serviceData.image] : []),
        isActive: serviceData.isActive !== undefined ? Boolean(serviceData.isActive) : true,
        price: Number(primaryVariant.price) || Number(serviceData.price) || 0,
        finalPrice: Number(primaryVariant.finalPrice) || Number(primaryVariant.price) || Number(serviceData.finalPrice) || 0,
        duration: primaryVariant.duration || serviceData.duration || "3 Months",
        durationDays: primaryVariant.durationDays || serviceData.durationDays || 92,
        tag: primaryVariant.tag || serviceData.badge || serviceData.tag || "",
        badge: serviceData.badge || primaryVariant.tag || "",
        variants: variants,
        plans: variants,
        datesConfig: serviceData.datesConfig || null,
        notes: serviceData.notes || "",
        createdBy: serviceData.createdBy || "Admin",
        creatorEmail: serviceData.creatorEmail || "",
        createdAt: serviceData.createdAt || null,
        updatedAt: serviceData.updatedAt || null,
        updatedBy: serviceData.updatedBy || "",
      });
    });

    // Sort descending by updatedAt or createdAt
    servicePlans.sort((a, b) => {
      const timeA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : (a.createdAt?.toMillis ? a.createdAt.toMillis() : 0);
      const timeB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : (b.createdAt?.toMillis ? b.createdAt.toMillis() : 0);
      return timeB - timeA;
    });

    return servicePlans;
  } catch (error) {
    console.error("Error fetching admin plans from services collection:", error);
    throw error;
  }
};

/**
 * Creates or updates a Service (with its child plans: []) in Firestore.
 * Saves to 'services' collection ONLY.
 */
export const saveCustomPlan = async (planData, planId = null, currentUser = null) => {
  try {
    const now = serverTimestamp();
    const rawVariants = planData.plans || planData.variants || [];
    const variants = rawVariants.map((v, idx) => sanitizePlanVariant(v, `Option ${idx + 1}`));
    const primaryVariant = variants[0] || {};

    const serviceTitle = (planData.title || planData.name || primaryVariant.name || "Service").trim();
    const category = planData.category || "Digital Marketing";
    const badge = planData.badge || planData.tag || primaryVariant.tag || "POPULAR";

    let targetId = planId || planData.id || planData.serviceId || planData.planId;
    if (!targetId || targetId === "null" || targetId === "undefined") {
      const slug = serviceTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      targetId = slug ? `${slug}-${Date.now().toString().slice(-4)}` : `service-${Date.now().toString().slice(-6)}`;
    }
    targetId = String(targetId);

    const imagesList = Array.isArray(planData.imageUrl)
      ? planData.imageUrl
      : (typeof planData.imageUrl === "string" && planData.imageUrl.trim() ? [planData.imageUrl.trim()] : []);

    const payload = {
      id: targetId,
      serviceId: targetId,
      planId: targetId,
      title: serviceTitle,
      name: serviceTitle,
      description: planData.description || "",
      category: category,
      categoryId: category.toLowerCase().replace(/ /g, "-"),
      badge: badge,
      tag: badge,
      imageUrl: imagesList,
      image: imagesList[0] || "",
      isActive: planData.isActive !== undefined ? Boolean(planData.isActive) : (planData.status === "published"),
      status: planData.status || "published", // draft, published, archived
      notes: planData.notes || "",

      // SERVICE ARCHITECTURE: Root service has plans: []
      plans: variants,
      variants: variants, // Backward compatibility

      // Pricing summary for Home catalog card & sorting
      pricing: {
        price: Number(primaryVariant.finalPrice) || Number(primaryVariant.price) || 0,
        regularPrice: Number(primaryVariant.price) || 0,
        discount: Number(primaryVariant.discountAmount) || 0,
        emiAvailable: primaryVariant.paymentOptions === "EMI" || primaryVariant.paymentOptions === "BOTH",
      },

      // Primary variant flat summary fields for backward compatibility
      price: Number(planData.price) || Number(primaryVariant.price) || 0,
      discountAmount: Number(planData.discountAmount) || Number(primaryVariant.discountAmount) || 0,
      finalPrice: Number(planData.finalPrice) || Number(primaryVariant.finalPrice) || Number(planData.price) || 0,
      currency: planData.currency || "INR",
      duration: primaryVariant.duration || "3 Months",
      durationDays: primaryVariant.durationDays || 92,
      planType: primaryVariant.planType || "3 Months",
      paymentOptions: planData.paymentOptions || primaryVariant.paymentOptions || "BOTH",
      emiConfig: planData.emiConfig || primaryVariant.emiConfig || {
        enabled: true,
        upfrontType: "percentage",
        upfrontValue: 15,
        upfrontAmount: 0,
        remainingAmount: 0,
        totalCycles: 1,
        emiAmount: 0,
        billingInterval: "monthly",
        firstDebitDays: 30,
      },
      features: planData.features || primaryVariant.features || [],

      // Dates Configuration
      datesConfig: {
        availabilityStart: planData.datesConfig?.availabilityStart || null,
        availabilityEnd: planData.datesConfig?.availabilityEnd || null,
        serviceStart: planData.datesConfig?.serviceStart || null,
        serviceDurationDays: Number(planData.datesConfig?.serviceDurationDays) || Number(primaryVariant.durationDays) || 30,
      },
      updatedAt: now,
      updatedBy: currentUser?.uid || "admin",
      editorEmail: currentUser?.email || "",
    };

    if (!planId) {
      payload.createdAt = now;
      payload.createdBy = currentUser?.uid || "admin";
      payload.creatorEmail = currentUser?.email || "";
    }

    // PRIMARY WRITE: Save directly and ONLY into 'services' collection!
    const serviceRef = doc(db, "services", targetId);
    await setDoc(serviceRef, payload, { merge: true });

    return { id: targetId, ...payload };
  } catch (error) {
    console.error("Error saving service:", error);
    throw error;
  }
};

/**
 * Soft archives a plan/service in 'services' collection.
 */
export const archivePlan = async (planId, currentUser = null) => {
  try {
    const idStr = String(planId);
    const updateData = {
      status: "archived",
      isActive: false,
      archivedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: currentUser?.uid || "admin",
    };
    await setDoc(doc(db, "services", idStr), updateData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error archiving service:", error);
    throw error;
  }
};

/**
 * Publishes a draft or archived service in 'services' collection.
 */
export const publishPlan = async (planId, currentUser = null) => {
  try {
    const idStr = String(planId);
    const updateData = {
      status: "published",
      isActive: true,
      publishedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: currentUser?.uid || "admin",
    };
    await setDoc(doc(db, "services", idStr), updateData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error publishing service:", error);
    throw error;
  }
};

/**
 * Permanently deletes a service document from 'services' collection.
 */
export const deletePlan = async (planId) => {
  try {
    const idStr = String(planId);
    await deleteDoc(doc(db, "services", idStr));
    return true;
  } catch (error) {
    console.error("Error deleting service from services collection:", error);
    throw error;
  }
};


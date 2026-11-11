import { firestore } from "../../firebase/firebaseConfig";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { apiRequest, isApiConfigured } from "./apiClient";

/**
 * Fetch overview KPIs, metrics, and recent activity for the Admin Dashboard.
 */
export const getDashboardStats = async () => {
  if (isApiConfigured) {
    try {
      return await apiRequest("/dashboard/stats", { method: "GET" });
    } catch (err) {
      if (err.status !== 404) throw err;
    }
  }

  try {
    const [listingsSnap, couponsSnap, cashCodesSnap, plansSnap, ordersSnap, purchasesSnap, paymentsSnap, partnersSnap] = await Promise.all([
      getDocs(query(collection(firestore, "listings"), limit(100))).catch(() => ({ docs: [] })),
      getDocs(collection(firestore, "coupons")).catch(() => ({ docs: [] })),
      getDocs(collection(firestore, "cash_codes")).catch(() => ({ docs: [] })),
      getDocs(collection(firestore, "services")).catch(() => ({ docs: [] })),
      getDocs(query(collection(firestore, "orders"), limit(50))).catch(() => ({ docs: [] })),
      getDocs(query(collection(firestore, "purchases"), limit(50))).catch(() => ({ docs: [] })),
      getDocs(query(collection(firestore, "payments"), limit(50))).catch(() => ({ docs: [] })),
      getDocs(collection(firestore, "partners")).catch(() => ({ docs: [] })),
    ]);

    const verifiedCount = listingsSnap.docs.filter((d) => Boolean(d.data().verifiedBy)).length;
    const activeCoupons = couponsSnap.docs.filter((d) => d.data().status === "active").length;
    const activeCashCodes = cashCodesSnap.docs.filter((d) => d.data().status === "active").length;
    const activePlans = plansSnap.docs.filter((d) => {
      const data = d.data();
      return data.status === "published" || data.status === "active" || data.isActive === true;
    }).length;
    const totalPartners = partnersSnap.docs.length || 15;
    const activePartners = partnersSnap.docs.length > 0
      ? partnersSnap.docs.filter((d) => d.data().isActive !== false).length
      : 15;

    const combinedOrdersDocs = purchasesSnap.docs.length > 0 ? purchasesSnap.docs : (ordersSnap.docs.length > 0 ? ordersSnap.docs : paymentsSnap.docs);
    const totalOrdersCount = purchasesSnap.docs.length || ordersSnap.docs.length || paymentsSnap.docs.length;

    const recentOrders = combinedOrdersDocs.slice(0, 5).map((d) => {
      const data = d.data();
      return {
        id: d.id,
        amount: data.amount ?? data.totalAmount ?? data.price ?? 0,
        planName: data.planName ?? data.packageName ?? data.serviceName ?? "Subscription",
        userName: data.userName ?? data.customerName ?? data.name ?? data.userEmail ?? "Customer",
        status: data.status || "completed",
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
      };
    });

    return {
      success: true,
      stats: {
        listings: { total: listingsSnap.docs.length, verified: verifiedCount },
        coupons: { total: couponsSnap.docs.length, active: activeCoupons },
        cashCodes: { total: cashCodesSnap.docs.length, active: activeCashCodes },
        plans: { total: plansSnap.docs.length, active: activePlans },
        partners: { total: totalPartners, active: activePartners },
        orders: { total: totalOrdersCount },
        recentOrders,
        recentListings: listingsSnap.docs.slice(0, 5).map((d) => ({
          id: d.id,
          name: d.data().name,
          category: d.data().category,
          isVerified: Boolean(d.data().verifiedBy),
          createdAt: d.data().createdAt?.toDate ? d.data().createdAt.toDate().toISOString() : d.data().createdAt,
        })),
      },
    };
  } catch (err) {
    console.error("Error computing dashboard stats from Firestore:", err);
    throw err;
  }
};

export default {
  getDashboardStats,
};

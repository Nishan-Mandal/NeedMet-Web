import * as authService from "./Auth";
import * as dashboardService from "./Dashboard";
import * as listingService from "./Listing";
import * as couponService from "./Coupons";
import * as cashCodeService from "./cashCodes";
import * as planService from "./Plans";
import * as orderService from "./Orders";
import * as paymentService from "./Payments";
import * as partnerService from "./Partners";
import * as reviewService from "./Reviews";

/**
 * NeedMet Admin API Unified Gateway.
 * Aggregates specialized domain services for backwards compatibility and single-point access.
 */
export const adminApi = {
  // Auth & Session Verification
  ...authService,

  // Dashboard & Metrics
  ...dashboardService,

  // Listings Management
  ...listingService,

  // Coupons Management
  ...couponService,

  // Cash Codes Management
  ...cashCodeService,

  // Subscription Plans & Services
  ...planService,

  // Orders & Purchases Management
  ...orderService,

  // Transactions & Payments Management
  ...paymentService,

  // Partners Management
  ...partnerService,

  // Review Moderation & Management
  ...reviewService,
};

export default adminApi;

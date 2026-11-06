import {
  LayoutDashboard,
  Store,
  PlusCircle,
  Tag,
  Coins,
  Package,
  ReceiptText,
  Images,
  Sparkles,
  Layers,
  Handshake,
  MessageSquareQuote,
  ShoppingBag,
  CreditCard,
} from "lucide-react";

/**
 * Route-based Page Header Metadata for Top Navbar
 */
export const PAGE_META = {
  "/admin": {
    title: "Dashboard",
    description: "Platform overview, metrics and real-time activity",
    icon: LayoutDashboard,
  },
  "/admin/dashboard": {
    title: "Dashboard",
    description: "Platform overview, metrics and real-time activity",
    icon: LayoutDashboard,
  },
  "/admin/listings": {
    title: "Manage Listings",
    description: "Audit merchant records, moderate content, and verify business claims.",
    icon: Store,
  },
  "/admin/all_listings": {
    title: "Manage Listings",
    description: "Audit merchant records, moderate content, and verify business claims.",
    icon: Store,
  },
  "/admin/listings/new": {
    title: "Add Business Listing",
    description: "Securely provision and verify a merchant profile directly from the admin console.",
    icon: PlusCircle,
  },
  "/admin/coupons": {
    title: "Coupon Management",
    description: "Configure promotional discount codes, validity periods, and usage limits.",
    icon: Tag,
  },
  "/admin/cash-codes": {
    title: "Cash Codes Management",
    description: "Issue cryptographically secure store credit codes with immutable audit records.",
    icon: Coins,
  },
  "/admin/plans": {
    title: "Subscription Plans",
    description: "Configure tiers, pricing, and feature quotas.",
    icon: Package,
  },
  "/admin/orders": {
    title: "Orders & Purchases",
    description: "Customer plan purchase ledger, subscriptions, and fulfillment records.",
    icon: ShoppingBag,
  },
  "/admin/transactions": {
    title: "Transactions & Payments",
    description: "Payment gateway logs, settlements, refunds, and transaction audit trails.",
    icon: CreditCard,
  },
  "/admin/banners": {
    title: "Promo & Banner Management",
    description: "Configure promotional hero graphics, viewport assets, and redirect routing.",
    icon: Sparkles,
  },
  "/admin/home-banners": {
    title: "Promo & Banner Management",
    description: "Manage homepage category divider banners and display priorities.",
    icon: Images,
  },
  "/admin/posters": {
    title: "Promo & Banner Management",
    description: "Configure spotlight posters and vertical marketing displays.",
    icon: Layers,
  },
  "/admin/partners": {
    title: "Partner Management",
    description: "Configure brand partners and live marquee for the homepage.",
    icon: Handshake,
  },
  "/admin/home-partners": {
    title: "Partner Management",
    description: "Manage homepage brand partners and preview the interactive marquee.",
    icon: Handshake,
  },
  "/admin/reviews": {
    title: "Reviews & Feedback",
    description: "Moderate submitted customer feedback before it appears in homepage testimonials.",
    icon: MessageSquareQuote,
  },
};

export const DEFAULT_PAGE_META = {
  title: "Admin Console",
  description: "NeedMet Management Suite",
  icon: Store,
};

import {
  LayoutDashboard,
  Store,
  ListFilter,
  PlusCircle,
  Tag,
  Coins,
  Package,
  ReceiptText,
  TicketPercent,
  Images,
  Sparkles,
  Layers,
  Handshake,
  MessageSquareQuote,
  ShoppingBag,
  CreditCard,
} from "lucide-react";

/**
 * Hierarchical tree navigation configuration for NeedMet Admin Panel
 */
export const navTree = [
  {
    type: "link",
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & Analytics",
  },
  {
    type: "group",
    id: "listings",
    label: "Manage Listing",
    icon: Store,
    description: "Directory management",
    children: [
      {
        to: "/admin/listings",
        label: "All Listings",
        icon: ListFilter,
        description: "Search, verify & edit",
      },
      {
        to: "/admin/listings/new",
        label: "Add Listing",
        icon: PlusCircle,
        description: "Provision business record",
      },
    ],
  },
  {
    type: "group",
    id: "offers",
    label: "Offers & Plans",
    icon: TicketPercent,
    description: "Coupons, Cash Codes & Plans",
    children: [
      {
        to: "/admin/cash-codes",
        label: "Cash Codes",
        icon: Coins,
        description: "Redemption & audits",
      },
      {
        to: "/admin/coupons",
        label: "Coupons",
        icon: Tag,
        description: "Discounts & usage limits",
      },
      {
        to: "/admin/plans",
        label: "Plans",
        icon: Package,
        description: "Subscriptions & tiers",
      },
    ],
  },
  {
    type: "group",
    id: "ordersAndTransactions",
    label: "Orders & Transactions",
    icon: ReceiptText,
    description: "Purchases and payments ledger",
    children: [
      {
        to: "/admin/orders",
        label: "Orders",
        icon: ShoppingBag,
        description: "Customer purchase ledger & plans",
      },
      {
        to: "/admin/transactions",
        label: "Transactions",
        icon: CreditCard,
        description: "Payment gateway logs & settlements",
      },
    ],
  },
  {
    type: "group",
    id: "promoBanner",
    label: "Promo & Banner",
    icon: Images,
    description: "Promo banners, home dividers & posters",
    children: [
      {
        to: "/admin/banners",
        label: "Promo Banners",
        icon: Sparkles,
        description: "Promotional hero & section banners",
      },
      {
        to: "/admin/home-banners",
        label: "Home Banners",
        icon: Images,
        description: "Category showcase banners",
      },
      {
        to: "/admin/posters",
        label: "Posters",
        icon: Layers,
        description: "Spotlight promotional posters",
      },
    ],
  },
  {
    type: "link",
    to: "/admin/partners",
    label: "Partner Management",
    icon: Handshake,
    description: "Homepage brand partner marquee",
  },
  {
    type: "link",
    to: "/admin/reviews",
    label: "Reviews & Feedback",
    icon: MessageSquareQuote,
    description: "Moderate homepage customer testimonials",
  },
];

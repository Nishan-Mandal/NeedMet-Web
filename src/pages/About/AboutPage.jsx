import { Link } from "react-router-dom";
import { SEO, BusinessCTA } from "../../components";

/* ──────────────────────────────────────────────────────────────
   AboutPage.jsx
   Premium, responsive About Us page for NeedMet:
   - Hero banner with brand messaging
   - Mission & Vision statement cards
   - 5 Core Product Pillars (Search, Contact, Rewards, Groups, Spotlight)
   - Step-by-Step Community Roadmap
   - Trust, Safety & Privacy Commitments
   - Interactive CTA section
─────────────────────────────────────────────────────────────── */

export default function AboutPage() {
  const PILLARS = [
    {
      icon: "fa-solid fa-magnifying-glass-location",
      title: "Search & Discover",
      description:
        "Find nearby stores, local professionals, emergency services, rental spaces, and events with instant category filters tailored to your immediate locality.",
      badge: "Hyperlocal",
    },
    {
      icon: "fa-solid fa-phone-volume",
      title: "Instant Direct Contact",
      description:
        "Skip the middlemen. Directly call verified phone numbers, get turn-by-turn Google Maps directions, or chat with listing owners in one tap.",
      badge: "Zero Friction",
    },
    {
      icon: "fa-solid fa-award",
      title: "Contributions & Kudos",
      description:
        "NeedMet thrives on community contributions. Add missing places or improve listings to earn Kudos points redeemable for real rewards and vouchers.",
      badge: "Earn Rewards",
    },
    {
      icon: "fa-solid fa-people-group",
      title: "Neighborhood Groups",
      description:
        "Join neighborhood discussions to share local updates, recommendations, and news with residents living right in your vicinity.",
      badge: "Community",
    },
    {
      icon: "fa-solid fa-bullhorn",
      title: "Spotlight & Promotions",
      description:
        "Promote new store openings, seasonal discounts, and neighborhood events directly on the community home feed for high local visibility.",
      badge: "Growth",
    },
  ];

  const HOW_IT_WORKS = [
    {
      step: "01",
      title: "Search or Browse",
      description: "Search for nearby shops or explore curated categories like Groceries, Repairs, Medical, and Dining.",
    },
    {
      step: "02",
      title: "View Verified Details",
      description: "Check operating hours, photos, ratings, directions, and community reviews before you visit.",
    },
    {
      step: "03",
      title: "Contribute & Enrich",
      description: "Add new businesses or submit edits for existing ones. Every approved contribution earns Kudos.",
    },
    {
      step: "04",
      title: "Redeem Kudos",
      description: "Accumulate Kudos on your profile and redeem them for exciting perks, vouchers, or rewards.",
    },
    {
      step: "05",
      title: "Stay Connected",
      description: "Engage in local area forums, share reviews, and stay updated with your neighborhood pulse.",
    },
  ];

  const COMMITMENTS = [
    {
      icon: "fa-solid fa-shield-halved",
      title: "Data Accuracy",
      description: "Automated verification routines coupled with active community moderation keep business listings authentic and fresh.",
    },
    {
      icon: "fa-solid fa-user-lock",
      title: "Privacy First",
      description: "We collect only minimal necessary data to provide discovery services. Learn more in our Privacy Policy.",
      linkText: "Read Privacy Policy",
      linkTo: "/docs/privacy_policy",
    },
    {
      icon: "fa-solid fa-heart-circle-check",
      title: "Safe Community",
      description: "Zero tolerance for spam, harassment, discrimination, or deceptive listings. Enforced by community guidelines.",
      linkText: "Community Guidelines",
      linkTo: "/docs/community_guidelines",
    },
    {
      icon: "fa-solid fa-scale-balanced",
      title: "Transparency",
      description: "All contributions, Kudos rewards, and moderation actions are logged and auditable to maintain community trust.",
    },
  ];

  return (
    <>
      <SEO
        title="About Us — Hyperlocal Discovery & Community Platform | NeedMet"
        description="Learn about NeedMet, India's community-driven local discovery network. Discover nearby stores, services, rental rooms, events, and neighborhood updates in one place."
      />

      <div className="min-h-screen bg-[#f8faf9] font-primary text-text">
        
        {/* ── 1. Hero Section ───────────────────────────────────── */}
        <div className="relative overflow-hidden bg-gradient-to-b from-primary-surface/60 via-white to-[#f8faf9] border-b border-border/60 py-12 sm:py-16 lg:py-20">
          
          {/* Subtle decorative background ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden opacity-60">
            <div className="absolute -top-24 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute top-10 right-1/4 w-80 h-80 bg-accent-emerald/15 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-surface border border-primary/20 text-primary text-xs sm:text-sm font-bold shadow-2xs mb-4 sm:mb-6">
              <i className="fa-solid fa-map-location-dot text-primary"></i>
              <span>About NeedMet</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-text tracking-tight leading-[1.15] max-w-4xl mx-auto m-0">
              Connecting Neighborhoods,{" "}
              <span className="text-primary bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Empowering Local Businesses
              </span>
            </h1>

            {/* Subtitle / Lead Paragraph */}
            <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto m-0 font-normal">
              NeedMet is a community-driven hyperlocal discovery platform that makes it effortless to find nearby services, shops, rental spaces, events, and neighbourhood updates — all in one unified place.
            </p>

            {/* Quick Highlight Pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 max-w-3xl mx-auto">
              {[
                { icon: "fa-solid fa-location-crosshairs", text: "100% Hyperlocal" },
                { icon: "fa-solid fa-users", text: "Community Powered" },
                { icon: "fa-solid fa-coins", text: "Earn Kudos Points" },
                { icon: "fa-solid fa-bolt", text: "Instant Direct Connect" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-border/80 text-xs sm:text-sm font-semibold text-text shadow-2xs"
                >
                  <i className={`${item.icon} text-primary text-xs`}></i>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── 2. Mission & Vision Section ──────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            
            {/* Mission Card */}
            <div className="relative rounded-2xl bg-white border border-border/80 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-primary-surface text-primary flex items-center justify-center text-xl mb-4 group-hover:scale-105 transition-transform shadow-2xs">
                <i className="fa-solid fa-bullseye"></i>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary font-heading">
                Our Purpose
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-text mt-1 mb-3">
                Our Mission
              </h2>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed m-0">
                To empower local communities with accurate, timely, and usable neighbourhood information, so people can quickly find the services they need and small local businesses get the visibility and growth they deserve.
              </p>
            </div>

            {/* Vision Card */}
            <div className="relative rounded-2xl bg-white border border-border/80 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-primary-surface text-primary flex items-center justify-center text-xl mb-4 group-hover:scale-105 transition-transform shadow-2xs">
                <i className="fa-solid fa-lightbulb"></i>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary font-heading">
                Our Horizon
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-text mt-1 mb-3">
                Our Vision
              </h2>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed m-0">
                A world where every neighbourhood is digitally mapped, every independent store and service provider has an active voice, and every resident can effortlessly contribute to—and benefit from—their community's shared knowledge.
              </p>
            </div>

          </div>
        </div>

        {/* ── 3. What We Do (5 Core Pillars) ─────────────────────── */}
        <div className="bg-white border-y border-border/60 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-primary font-heading">
                Comprehensive Local Hub
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-text mt-1">
                What You Can Do on NeedMet
              </h2>
              <p className="text-sm sm:text-base text-text-secondary mt-2 m-0">
                A complete local ecosystem designed to connect residents with nearby shops, services, and neighborhood alerts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {PILLARS.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/80 bg-background-secondary/50 p-6 hover:bg-white hover:border-primary/30 hover:shadow-sm transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-surface text-primary flex items-center justify-center text-lg group-hover:scale-105 transition-transform shadow-2xs">
                        <i className={item.icon}></i>
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold font-heading text-text m-0 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed m-0">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── 4. How It Works (Step-by-Step Roadmap) ───────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-heading">
              Simple & Intuitive
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-text mt-1">
              How NeedMet Works
            </h2>
            <p className="text-sm sm:text-base text-text-secondary mt-2 m-0">
              From finding emergency services to contributing new shops and earning Kudos rewards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {HOW_IT_WORKS.map((step, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl bg-white border border-border/80 p-5 shadow-2xs hover:border-primary/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black font-heading text-primary/30 block mb-2">
                    {step.step}
                  </span>
                  <h3 className="text-sm font-bold font-heading text-text m-0 mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed m-0">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. Our Commitments (Trust, Privacy & Safety) ──────── */}
        <div className="bg-white border-t border-border/60 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-primary font-heading">
                Built on Trust
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-text mt-1">
                Our Community Commitments
              </h2>
              <p className="text-sm sm:text-base text-text-secondary mt-2 m-0">
                Operating with safety, accuracy, and clear transparency at every step.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {COMMITMENTS.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/80 p-5 sm:p-6 bg-background-secondary/40 flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-surface text-primary flex items-center justify-center text-lg shrink-0 shadow-2xs mt-0.5">
                    <i className={item.icon}></i>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold font-heading text-text m-0 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed m-0">
                      {item.description}
                    </p>
                    {item.linkTo && (
                      <Link
                        to={item.linkTo}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark mt-2.5 no-underline"
                      >
                        <span>{item.linkText}</span>
                        <i className="fa-solid fa-arrow-right text-[10px]"></i>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── 6. Business CTA Section ───────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <BusinessCTA />
        </div>

      </div>
    </>
  );
}

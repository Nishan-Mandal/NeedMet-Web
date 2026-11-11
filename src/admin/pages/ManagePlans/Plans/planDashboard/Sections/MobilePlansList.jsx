import { Link } from "react-router-dom";
import {
  formatDate,
  getServiceCoverImage,
  calculatePriceRange,
  formatPlanDuration,
  getSafeDurationDays,
  formatPlanTitle,
  getServicePaymentModeSummary,
  formatEmiScheduleSummary,
} from "../utils/dashboard.utils";
import ServiceActionMenu from "./ServiceActionMenu";

export default function MobilePlansList({
  plans = [],
  expandedServiceIds,
  onToggleExpand,
  onToggleStatus,
  onDeleteClick,
  onCloneClick,
  actionInProgress,
}) {
  return (
    <div className="block lg:hidden p-3 sm:p-4 space-y-3.5 bg-slate-50/60">
      {plans.map((plan) => {
        const isPublished = plan.status === "published";
        const isDraft = plan.status === "draft";
        const isArchived = plan.status === "archived";
        const subPlans = plan.plans || plan.variants || [];
        const isExpanded = expandedServiceIds?.has(plan.id);

        const coverImg = getServiceCoverImage(plan);
        const { minPrice, maxPrice, isRange } = calculatePriceRange(plan);
        const paymentSummary = getServicePaymentModeSummary(plan);

        return (
          <div
            key={plan.id}
            className="rounded-2xl border border-gray-200/90 bg-white p-4 shadow-2xs space-y-3.5 transition hover:border-gray-300 text-left"
          >
            {/* TOP HEADER: Cover, Category, Title, Price, Status & Three-Dot Menu */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                {coverImg ? (
                  <img
                    src={coverImg}
                    alt={plan.name}
                    className="h-14 w-14 rounded-2xl object-cover shrink-0 border border-gray-100 shadow-2xs"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-[#266C51] border border-emerald-100 shadow-2xs">
                    <span className="material-symbols-outlined text-2xl">design_services</span>
                  </div>
                )}

                <div className="min-w-0 flex-1 space-y-1">
                  {/* Badges row */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#266C51]">
                      {plan.category || "Service"}
                    </span>
                    {(plan.badge || plan.tag) && (
                      <span className="rounded-md bg-emerald-100/80 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        {plan.badge || plan.tag}
                      </span>
                    )}
                    {isPublished && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Live
                      </span>
                    )}
                    {isDraft && (
                      <span className="inline-flex items-center rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        Draft
                      </span>
                    )}
                    {isArchived && (
                      <span className="inline-flex items-center rounded-md bg-gray-100 border border-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                        Archived
                      </span>
                    )}
                  </div>

                  {/* Service Title */}
                  <h3 className="font-bold text-gray-900 text-base leading-snug truncate" title={plan.name}>
                    {plan.name}
                  </h3>

                  {/* Price Range */}
                  <p className="text-sm font-bold text-[#266C51]">
                    {isRange ? (
                      <span>
                        ₹{minPrice.toLocaleString("en-IN")} – ₹{maxPrice.toLocaleString("en-IN")}
                      </span>
                    ) : (
                      <span>₹{minPrice.toLocaleString("en-IN")}</span>
                    )}
                    {paymentSummary.isEmiEligible ? (
                      <span className="ml-1.5 text-xs text-emerald-700 font-semibold">
                        ({paymentSummary.label})
                      </span>
                    ) : (
                      <span className="ml-1.5 text-xs text-gray-500 font-normal">
                        ({paymentSummary.label})
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* THREE-DOT ACTIONS DROPDOWN */}
              <div className="shrink-0 -mr-1">
                <ServiceActionMenu
                  plan={plan}
                  onToggleStatus={onToggleStatus}
                  onDeleteClick={onDeleteClick}
                  onCloneClick={onCloneClick}
                  actionInProgress={actionInProgress}
                  align="right"
                />
              </div>
            </div>

            {/* MIDDLE: DURATION PLANS AREA (Phone-Optimized) */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-3 space-y-2.5">
              {/* Header Bar with Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                  <span className="material-symbols-outlined text-base text-[#266C51]">
                    calendar_month
                  </span>
                  <span>Duration Options</span>
                  <span className="rounded-full bg-white border border-gray-200/90 px-2 py-0.5 text-xs font-bold text-gray-700">
                    {subPlans.length}
                  </span>
                </div>

                {subPlans.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onToggleExpand(plan.id)}
                    className="min-h-[38px] inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold text-[#266C51] bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-100/60 transition cursor-pointer"
                  >
                    <span>{isExpanded ? "Hide Tiers" : "View Tiers"}</span>
                    <span className="material-symbols-outlined text-base">
                      {isExpanded ? "expand_less" : "expand_more"}
                    </span>
                  </button>
                )}
              </div>

              {/* Collapsed View: Duration + Price Chips */}
              {subPlans.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {subPlans.map((sub, sIdx) => {
                    const finalP = sub.finalPrice || sub.price || 0;
                    return (
                      <div
                        key={sub.id || sIdx}
                        className="min-h-[36px] inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs shadow-2xs"
                      >
                        <span className="font-bold text-gray-800">
                          {formatPlanDuration(sub)}
                        </span>
                        <span className="h-3 w-[1px] bg-gray-200" />
                        <span className="font-bold text-[#266C51]">
                          ₹{finalP.toLocaleString("en-IN")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  Single tier default plan configured.
                </p>
              )}

              {/* Expanded View: Dedicated Tier Breakdown Cards */}
              {isExpanded && subPlans.length > 0 && (
                <div className="pt-2.5 border-t border-gray-200/70 space-y-2.5 animate-in fade-in duration-200">
                  {subPlans.map((sub, sIdx) => {
                    const finalP = sub.finalPrice || sub.price || 0;
                    const originalP = sub.price || 0;
                    const hasDiscount = sub.discountAmount > 0;
                    const safeDays = getSafeDurationDays(sub);
                    const safeDur = formatPlanDuration(sub);
                    const safeTitle = formatPlanTitle(sub);

                    return (
                      <div
                        key={sub.id || sIdx}
                        className="rounded-xl border border-gray-200/90 bg-white p-3 space-y-2 shadow-2xs"
                      >
                        {/* Tier Header: Name + Badge + Price */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-bold text-gray-900 text-sm truncate">
                              {safeTitle}
                            </span>
                            {sub.tag && (
                              <span className="rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                                {sub.tag}
                              </span>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-bold text-[#266C51] text-sm">
                              ₹{finalP.toLocaleString("en-IN")}
                            </span>
                            {hasDiscount && (
                              <span className="ml-1.5 text-xs text-gray-400 line-through">
                                ₹{originalP.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Tier Details: Schedule, Payment Mode, EMI & Deliverables */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-gray-400">
                              schedule
                            </span>
                            <span>{safeDays} Days ({safeDur})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-gray-400">
                              payments
                            </span>
                            <span>
                              {sub.paymentOptions === "BOTH"
                                ? "Full & EMI"
                                : sub.paymentOptions === "EMI"
                                ? "EMI Only"
                                : "Full Payment"}
                            </span>
                          </div>

                          {(() => {
                            const emiInfo = formatEmiScheduleSummary(sub);
                            if (!emiInfo.isEmi) return null;
                            return (
                              <div className="col-span-2 text-emerald-700 font-semibold">
                                ↳ {emiInfo.text}
                              </div>
                            );
                          })()}

                          {(sub.features || []).length > 0 && (
                            <div className="col-span-2 text-gray-500">
                              ✓ {(sub.features || []).length} deliverables included
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CARD FOOTER: Last updated & Quick Mobile Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500 gap-2">
              <span className="text-xs text-gray-400">
                {formatDate(plan.updatedAt || plan.createdAt)}
              </span>

              <div className="flex items-center gap-2">
                <Link
                  to={`/service/${plan.serviceId || plan.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[38px] inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  <span>View</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </Link>

                <Link
                  to={`/admin/plans/edit/${plan.id}`}
                  className="min-h-[38px] inline-flex items-center gap-1 rounded-xl bg-[#266C51] px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#1f5741] transition"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span>Edit</span>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

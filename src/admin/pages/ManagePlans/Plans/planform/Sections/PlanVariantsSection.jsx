import React from "react";
import {
  VariantHeader,
  VariantTabs,
  VariantIdentitySection,
  VariantPricingSection,
  VariantEmiSection,
  VariantFeaturesSection,
} from "./Variants";

export default function PlanVariantsSection({
  variants = [],
  selectedVariantIndex = 0,
  onSelectVariantIndex,
  onAddPresetVariant,
  onAddCustomVariant,
  onDuplicateVariant,
  onRemoveVariant,
  onUpdateVariant,
  variantCalculations = [],
  onAddVariantFeature,
  onUpdateVariantFeature,
  onRemoveVariantFeature,
  onApplyVariantBulkFeatures,
  onCopyFeatures,
  isExpanded = true,
  onToggleExpand,
}) {
  const activeIndex = Math.min(
    Math.max(selectedVariantIndex, 0),
    Math.max(variants.length - 1, 0)
  );
  const activeVariant = variants[activeIndex] || {};
  const activeCalc = variantCalculations[activeIndex] || {
    finalPrice: 0,
    upfrontAmount: 0,
    remainingAmount: 0,
    cycles: 1,
    emiAmount: 0,
    discountPercent: 0,
  };

  return (
    <div className="rounded-2xl sm:rounded-xl border border-gray-200/70 bg-white p-4 sm:p-4 shadow-2xs space-y-3.5 sm:space-y-3 text-left">
      {/* 1. Section Header & Quick Tier Presets */}
      <VariantHeader
        variantsCount={variants.length}
        onAddPresetVariant={onAddPresetVariant}
        onAddCustomVariant={onAddCustomVariant}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
      />

      {/* Collapsed State Summary */}
      {!isExpanded && (
        <div
          onClick={onToggleExpand}
          className="flex items-center justify-between text-xs text-gray-600 bg-gray-50/70 rounded-xl p-3 cursor-pointer hover:bg-gray-100/70 transition border border-gray-100"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-900">
              {variants.length} Duration Tier{variants.length === 1 ? "" : "s"}:
            </span>
            {variants.map((v, i) => (
              <span
                key={i}
                className="rounded-md bg-white border border-gray-200 px-2 py-0.5 text-[11px] font-semibold text-gray-700 shadow-2xs"
              >
                {v.name || v.duration || `Tier ${i + 1}`}
                {v.price ? ` • ₹${Number(v.price).toLocaleString("en-IN")}` : ""}
              </span>
            ))}
          </div>
          <span className="text-[11px] text-[#266C51] font-bold shrink-0 ml-2">Tap to expand</span>
        </div>
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <>
          {/* 2. Plan Selector Tabs Strip */}
          <VariantTabs
            variants={variants}
            activeIndex={activeIndex}
            variantCalculations={variantCalculations}
            onSelectVariantIndex={onSelectVariantIndex}
            onRemoveVariant={onRemoveVariant}
          />

          {/* 3. Active Tier Config Sections */}
          <div className="space-y-3 pt-0.5">
            {/* Tier Identity, Controls & Duration */}
            <VariantIdentitySection
              activeVariant={activeVariant}
              activeIndex={activeIndex}
              onUpdateVariant={onUpdateVariant}
              onDuplicateVariant={onDuplicateVariant}
            />

            {/* Pricing & Payment Modes */}
            <VariantPricingSection
              activeVariant={activeVariant}
              activeIndex={activeIndex}
              activeCalc={activeCalc}
              onUpdateVariant={onUpdateVariant}
            />

            {/* EMI & Down Payment Schedule (for EMI-enabled plans) */}
            <VariantEmiSection
              activeVariant={activeVariant}
              activeIndex={activeIndex}
              activeCalc={activeCalc}
              onUpdateVariant={onUpdateVariant}
            />

            {/* Deliverables & Features */}
            <VariantFeaturesSection
              activeVariant={activeVariant}
              activeIndex={activeIndex}
              variants={variants}
              onAddVariantFeature={onAddVariantFeature}
              onUpdateVariantFeature={onUpdateVariantFeature}
              onRemoveVariantFeature={onRemoveVariantFeature}
              onApplyVariantBulkFeatures={onApplyVariantBulkFeatures}
              onCopyFeatures={onCopyFeatures}
            />
          </div>
        </>
      )}
    </div>
  );
}

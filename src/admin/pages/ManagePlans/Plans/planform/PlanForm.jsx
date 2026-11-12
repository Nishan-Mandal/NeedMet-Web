import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import usePlanForm from "./hooks/usePlanForm";

import PlanBasicDetailsSection from "./Sections/PlanBasicDetailsSection";
import PlanImageGallerySection from "./Sections/PlanImageGallerySection";
import PlanVariantsSection from "./Sections/PlanVariantsSection";
// import PlanDatesNotesSection from "./Sections/PlanDatesNotesSection";
import ImagePreviewModal from "./Sections/ImagePreviewModal";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function PlanForm() {
  const { planId, clonePlanId } = useParams();
  const [searchParams] = useSearchParams();
  const cloneFromId = clonePlanId || searchParams.get("cloneFrom") || searchParams.get("clone");
  const isEditMode = Boolean(planId);
  const { currentUser, isAdmin, isStaff, authLoading } = useAuth();
  const navigate = useNavigate();

  // Security guard: redirect if not admin/staff
  useEffect(() => {
    if (!authLoading && (!currentUser || (!isAdmin && !isStaff))) {
      navigate("/login?redirect=/admin/plans");
    }
  }, [currentUser, isAdmin, isStaff, authLoading, navigate]);

  // Expand / collapse state for sections
  // On phone (< 640px): keep closed except basic info and pricing section
  // On desktop: all sections open by default
  const [expandedSections, setExpandedSections] = useState(() => {
    const isPhone = typeof window !== "undefined" && window.innerWidth < 640;
    return {
      basic: true, // open on phone & desktop
      media: !isPhone, // closed on phone, open on desktop
      pricing: true, // open on phone & desktop
      dates: !isPhone, // closed on phone, open on desktop
    };
  });

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const {
    isCloneMode,
    clonedFromTitle,
    formData,
    setFormData,
    loading,
    submitting,
    error,
    setError,
    imageErrorMap,
    previewModalUrl,
    pendingFilesMap,
    uploadingMap,
    isUploadingImages,
    uploadErrorsMap,
    handleRetryUpload,
    handleFilesSelected,
    setImageErrorMap,
    setPreviewModalUrl,
    handleChange,
    handleSetPrimaryImage,
    handleAddImage,
    handleRemoveImage,
    creatorInfo,
    variantCalculations,
    // Duration Variants API
    handleAddCustomVariant,
    handleDuplicateVariant,
    handleAddPresetVariant,
    setSelectedVariantIndex,
    handleAddVariantFeature,
    handleUpdateVariantFeature,
    handleUpdateVariant,
    handleRemoveVariant,
    handleCopyFeatures,
    handleSubmit,
    handleApplyVariantBulkFeatures,
    handleRemoveVariantFeature,
  } = usePlanForm({ planId, cloneFromId, isEditMode, currentUser, navigate });

  if (loading) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100vh-4rem)] w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#266C51] border-t-transparent" />
          <p className="text-xs font-semibold text-text-secondary">
            Loading service data...
          </p>
        </div>
      </div>
    );
  }

  const durationPlanCount = (formData.plans || formData.variants || []).length;

  return (
    <div className="space-y-6 w-full font-primary">
      {/* Back Action Bar */}
      <div className="flex items-center justify-between pb-1">
        <Link
          to="/admin/plans"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition shadow-xs text-xs font-semibold"
        >
          <ArrowLeft size={16} />
          <span>Back to Plans</span>
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          {(formData.badge || formData.tag) && (
            <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">
              {formData.badge || formData.tag}
            </span>
          )}
          <span className="rounded-full bg-purple-50 text-purple-700 border border-purple-200/80 px-3 py-1 text-xs font-bold">
            {durationPlanCount} Duration Plan{durationPlanCount === 1 ? "" : "s"}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              formData.isActive
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                : "bg-amber-50 text-amber-700 border border-amber-200/80"
            }`}
          >
            {formData.isActive ? "Storefront Active" : "Draft / Inactive"}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* TOP BAR TITLE */}
        <div className="pb-3 border-b border-gray-200/80">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            {isCloneMode
              ? "Clone Service & Plans"
              : isEditMode
              ? "Edit Service & Plans"
              : "Create New Service"}
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed mt-1">
            Configure service details, duration tiers (1M, 3M, 6M, etc.), EMI schedules, and deliverables.
          </p>
        </div>

        {/* Clone Mode Informative Callout Banner */}
        {isCloneMode && (
          <div className="rounded-xl border border-sky-200 bg-sky-50/80 p-3 sm:p-3.5 text-xs text-sky-900 flex items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start sm:items-center gap-2.5">
              <span className="material-symbols-outlined text-lg text-sky-600 shrink-0 mt-0.5 sm:mt-0">
                content_copy
              </span>
              <div className="space-y-0.5">
                <p className="font-bold text-sky-950 text-xs sm:text-xs">
                  Cloning from: <span className="text-sky-800 font-semibold">{clonedFromTitle || "Existing Plan"}</span>
                </p>
                <p className="text-xs sm:text-[11px] text-sky-700 leading-relaxed">
                  Prefilled with source plan configuration. Modifying details and saving will create a brand new plan with a unique ID without modifying the original.
                </p>
              </div>
            </div>
            <span className="rounded-md bg-sky-100 border border-sky-300 px-2 py-0.5 text-[10px] font-bold text-sky-800 uppercase tracking-wider shrink-0">
              New Plan
            </span>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 border border-red-200 text-xs font-semibold text-red-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-red-600">error</span>
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-800 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}

        {/* Quick Expand All / Collapse All controls */}
        <div className="flex items-center justify-end gap-2 text-xs text-gray-500">
          <button
            type="button"
            onClick={() => setExpandedSections({ basic: true, media: true, pricing: true, dates: true })}
            className="text-[11px] font-semibold text-gray-500 hover:text-[#266C51] transition cursor-pointer"
          >
            Expand All
          </button>
          <span className="text-gray-300">•</span>
          <button
            type="button"
            onClick={() => setExpandedSections({ basic: false, media: false, pricing: false, dates: false })}
            className="text-[11px] font-semibold text-gray-500 hover:text-[#266C51] transition cursor-pointer"
          >
            Collapse All
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          {/* 1. Identity & Basic Details */}
          <PlanBasicDetailsSection
            formData={formData}
            onChange={handleChange}
            onTagSelect={(badge) => setFormData((p) => ({ ...p, badge, tag: badge }))}
            isExpanded={expandedSections.basic}
            onToggleExpand={() => toggleSection("basic")}
          />

          {/* Availability & Dates Section - commented out per user request */}
          {/*
          <PlanDatesNotesSection
            formData={formData}
            creatorInfo={creatorInfo}
            onChange={handleChange}
            isExpanded={expandedSections.dates}
            onToggleExpand={() => toggleSection("dates")}
          />
          */}

          {/* 2. Media & Image Gallery */}
          <PlanImageGallerySection
            images={formData.images}
            pendingFilesMap={pendingFilesMap}
            uploadingMap={uploadingMap}
            isUploadingImages={isUploadingImages}
            uploadErrorsMap={uploadErrorsMap}
            onRetryUpload={handleRetryUpload}
            onFilesSelected={handleFilesSelected}
            onAddImage={handleAddImage}
            onRemoveImage={handleRemoveImage}
            onSetPrimaryImage={handleSetPrimaryImage}
            onPreviewImage={setPreviewModalUrl}
            imageErrorMap={imageErrorMap}
            onImageError={(imgUrl) =>
              setImageErrorMap((p) => ({ ...p, [imgUrl]: true }))
            }
            isExpanded={expandedSections.media}
            onToggleExpand={() => toggleSection("media")}
          />

          {/* 3. Duration Plans & Pricing / Deliverables */}
          <PlanVariantsSection
            variants={formData.plans || formData.variants || []}
            selectedVariantIndex={formData.selectedVariantIndex}
            onSelectVariantIndex={setSelectedVariantIndex}
            onAddPresetVariant={handleAddPresetVariant}
            onAddCustomVariant={handleAddCustomVariant}
            onDuplicateVariant={handleDuplicateVariant}
            onRemoveVariant={handleRemoveVariant}
            onUpdateVariant={handleUpdateVariant}
            variantCalculations={variantCalculations}
            onAddVariantFeature={handleAddVariantFeature}
            onUpdateVariantFeature={handleUpdateVariantFeature}
            onRemoveVariantFeature={handleRemoveVariantFeature}
            onApplyVariantBulkFeatures={handleApplyVariantBulkFeatures}
            onCopyFeatures={handleCopyFeatures}
            isExpanded={expandedSections.pricing}
            onToggleExpand={() => toggleSection("pricing")}
          />

          {/* Bottom Actions Bar (Mobile touch-friendly) */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-2.5 border-t border-gray-200/60 pt-4 pb-8 sm:pb-6">
            <Link
              to="/admin/plans"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl sm:rounded-lg border border-gray-200 bg-white px-5 py-2.5 sm:py-1.5 text-sm sm:text-xs font-semibold text-gray-700 hover:bg-gray-50 transition min-h-[44px] sm:min-h-0 cursor-pointer"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || isUploadingImages}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-lg bg-[#266C51] px-6 py-2.5 sm:py-1.5 text-sm sm:text-xs font-bold text-white shadow-sm hover:bg-[#1f5741] transition disabled:opacity-50 min-h-[44px] sm:min-h-0 cursor-pointer"
            >
              <span
                className={`material-symbols-outlined text-lg sm:text-base ${
                  submitting || isUploadingImages ? "animate-spin" : ""
                }`}
              >
                {submitting || isUploadingImages ? "progress_activity" : "save"}
              </span>
              <span>
                {submitting
                  ? (isCloneMode ? "Creating Cloned Plan..." : "Saving Service...")
                  : isUploadingImages
                  ? "Uploading Images..."
                  : isCloneMode
                  ? "Create Cloned Plan"
                  : isEditMode
                  ? "Update Service & Plans"
                  : "Publish Service & Plans"}
              </span>
            </button>
          </div>
        </form>

        {/* LIGHTBOX IMAGE PREVIEW MODAL (for image gallery clicks) */}
        <ImagePreviewModal
          url={previewModalUrl}
          onClose={() => setPreviewModalUrl(null)}
        />

      </div>
    </div>
  );
}

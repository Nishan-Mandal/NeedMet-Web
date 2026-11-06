import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchServices, fetchPlanById, saveCustomPlan } from "../../../../../services/db";
import { uploadPlanImageFile } from "../../../../../services/storage.service";
import {
  DEFAULT_PLAN_FORM,
  DURATION_PRESETS,
  createVariant,
  calculateVariantPricing,
  normalizeExistingPlan,
  clonePlanForForm,
  buildPlanPayload,
} from "../utils/planForm.utils";

export default function usePlanForm({ planId, cloneFromId, isEditMode, currentUser, navigate }) {
  const isCloneMode = Boolean(cloneFromId) && !isEditMode;
  const [clonedFromTitle, setClonedFromTitle] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(isEditMode || isCloneMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);


  // Image Modal Preview State & Staged Files
  const [previewModalUrl, setPreviewModalUrl] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [pendingFilesMap, setPendingFilesMap] = useState({}); // { [blobUrl]: File }
  const [uploadingMap, setUploadingMap] = useState({}); // { [blobUrl]: progressNumber }
  const [uploadErrorsMap, setUploadErrorsMap] = useState({}); // { [blobUrl]: errorMessage }
  const [imageErrorMap, setImageErrorMap] = useState({});

  const [formData, setFormData] = useState(DEFAULT_PLAN_FORM);
  const [creatorInfo, setCreatorInfo] = useState(null);

  // Load services and existing plan in edit mode or clone mode
  useEffect(() => {
    async function init() {
      try {
        const servicesList = await fetchServices();
        setServices(servicesList);

        if (isEditMode && planId) {
          const existingPlan = await fetchPlanById(planId);
          const normalized = normalizeExistingPlan(existingPlan);

          if (normalized) {
            setFormData(normalized.normalizedForm);
            setCreatorInfo(normalized.creatorInfo);
          } else {
            setError("Plan not found in database.");
          }
        } else if (isCloneMode && cloneFromId) {
          const sourcePlan = await fetchPlanById(cloneFromId);
          if (sourcePlan) {
            const cloned = clonePlanForForm(sourcePlan);
            setFormData(cloned.formData);
            setClonedFromTitle(cloned.sourceTitle || sourcePlan.title || sourcePlan.name || "Plan");
            setCreatorInfo(null);
          } else {
            setError("Source plan to clone not found in database.");
          }
        }
      } catch (err) {
        console.error("Error loading plan form data:", err);
        setError("Failed to load plan details.");
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) {
      init();
    }
  }, [planId, cloneFromId, isEditMode, isCloneMode, currentUser]);

  // Pricing calculations for each duration plan
  const variantCalculations = useMemo(() => {
    const plansList = formData.plans || formData.variants || [];
    return plansList.map((v) => calculateVariantPricing(v));
  }, [formData.plans, formData.variants]);

  // Generic top-level form change handler (title, description, category, status, badge, notes, etc.)
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const val = type === "checkbox" ? checked : value;
      const updated = {
        ...prev,
        [name]: val,
      };

      // Keep title and name synchronized for 100% interoperability
      if (name === "title") updated.name = val;
      if (name === "name") updated.title = val;

      // Keep badge and tag synchronized
      if (name === "badge") updated.tag = val;
      if (name === "tag") updated.badge = val;

      // Keep id and serviceId synchronized
      if (name === "id") updated.serviceId = val;
      if (name === "serviceId") updated.id = val;

      return updated;
    });
  }, []);

  // ==========================================
  // SERVICE PLANS (DURATION TIERS) HANDLERS
  // ==========================================

  const setSelectedVariantIndex = useCallback((index) => {
    setFormData((prev) => {
      const plansList = prev.plans || prev.variants || [];
      const clamped = Math.max(0, Math.min(index, (plansList.length || 1) - 1));
      return {
        ...prev,
        selectedVariantIndex: clamped,
        selectedPlanIndex: clamped,
      };
    });
  }, []);

  const handleAddPresetVariant = useCallback((presetKey) => {
    const preset = DURATION_PRESETS.find((p) => p.key === presetKey);
    if (!preset) return;

    setFormData((prev) => {
      const currentPlans = prev.plans || prev.variants || [];
      const existingFeatures = currentPlans[0]?.features || [];
      const newPlan = createVariant({
        name: preset.name,
        duration: preset.duration,
        durationDays: preset.durationDays,
        planType: preset.planType,
        tag: preset.tag,
        price: preset.defaultPrice,
        totalCycles: preset.defaultCycles,
        features: JSON.parse(JSON.stringify(existingFeatures)),
      });

      const updatedPlans = [...currentPlans, newPlan];
      return {
        ...prev,
        plans: updatedPlans,
        variants: updatedPlans,
        selectedVariantIndex: updatedPlans.length - 1,
        selectedPlanIndex: updatedPlans.length - 1,
      };
    });
  }, []);

  const handleAddCustomVariant = useCallback(() => {
    setFormData((prev) => {
      const currentPlans = prev.plans || prev.variants || [];
      const existingFeatures = currentPlans[0]?.features || [];
      const newPlan = createVariant({
        name: "Custom Duration Plan",
        duration: "Custom",
        durationDays: 45,
        planType: "Custom",
        tag: "Special",
        price: 4999,
        features: JSON.parse(JSON.stringify(existingFeatures)),
      });

      const updatedPlans = [...currentPlans, newPlan];
      return {
        ...prev,
        plans: updatedPlans,
        variants: updatedPlans,
        selectedVariantIndex: updatedPlans.length - 1,
        selectedPlanIndex: updatedPlans.length - 1,
      };
    });
  }, []);

  const handleDuplicateVariant = useCallback((indexToDuplicate) => {
    setFormData((prev) => {
      const currentPlans = prev.plans || prev.variants || [];
      const source = currentPlans[indexToDuplicate];
      if (!source) return prev;

      const duplicated = createVariant({
        ...source,
        id: `plan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        planId: "",
        name: `Copy of ${source.name}`,
        features: JSON.parse(JSON.stringify(source.features || [])),
      });

      const updatedPlans = [...currentPlans, duplicated];
      return {
        ...prev,
        plans: updatedPlans,
        variants: updatedPlans,
        selectedVariantIndex: updatedPlans.length - 1,
        selectedPlanIndex: updatedPlans.length - 1,
      };
    });
  }, []);

  const handleRemoveVariant = useCallback((indexToRemove) => {
    setFormData((prev) => {
      const currentPlans = prev.plans || prev.variants || [];
      if (currentPlans.length <= 1) return prev; // Keep at least one duration plan
      const updatedPlans = currentPlans.filter((_, idx) => idx !== indexToRemove);
      const newIndex = Math.min(prev.selectedVariantIndex, updatedPlans.length - 1);
      return {
        ...prev,
        plans: updatedPlans,
        variants: updatedPlans,
        selectedVariantIndex: newIndex,
        selectedPlanIndex: newIndex,
      };
    });
  }, []);

  const handleUpdateVariant = useCallback((variantIndex, field, value) => {
    setFormData((prev) => {
      const currentPlans = [...(prev.plans || prev.variants || [])];
      const target = { ...currentPlans[variantIndex], [field]: value };

      // Auto update planType & recommended cycles if durationDays changes
      if (field === "durationDays") {
        if (value === "" || value === null || value === undefined) {
          target.durationDays = "";
        } else {
          const days = Math.max(Number(value) || 0, 1);
          target.durationDays = days;
          const autoCycles = Math.max(Math.ceil((days - 5) / 30), 1);
          target.totalCycles = autoCycles;

          const isZeroOrDays =
            !target.duration ||
            /^\s*0\s*days?\s*$/i.test(target.duration) ||
            target.duration.includes("Days");

          if (days >= 360) {
            target.planType = "1 Year";
            if (isZeroOrDays) target.duration = "12 Months";
          } else if (days >= 170) {
            target.planType = "6 Months";
            if (isZeroOrDays) target.duration = "6 Months";
          } else if (days >= 80) {
            target.planType = "3 Months";
            if (isZeroOrDays) target.duration = "3 Months";
          } else if (days === 30) {
            target.planType = "1 Month";
            if (isZeroOrDays) target.duration = "1 Month";
          } else {
            target.planType = "Custom";
            if (isZeroOrDays) target.duration = `${days} Days`;
          }
        }
      }

      currentPlans[variantIndex] = target;
      return { ...prev, plans: currentPlans, variants: currentPlans };
    });
  }, []);

  // Plan Deliverable Features Handlers
  const handleAddVariantFeature = useCallback((variantIndex) => {
    setFormData((prev) => {
      const currentPlans = [...(prev.plans || prev.variants || [])];
      const target = currentPlans[variantIndex];
      target.features = [
        ...(target.features || []),
        { icon: "check_circle", title: "", desc: "" },
      ];
      currentPlans[variantIndex] = { ...target };
      return { ...prev, plans: currentPlans, variants: currentPlans };
    });
  }, []);

  const handleUpdateVariantFeature = useCallback((variantIndex, featIndex, field, value) => {
    setFormData((prev) => {
      const currentPlans = [...(prev.plans || prev.variants || [])];
      const target = currentPlans[variantIndex];
      const feats = [...(target.features || [])];
      feats[featIndex] = { ...feats[featIndex], [field]: value };
      target.features = feats;
      currentPlans[variantIndex] = { ...target };
      return { ...prev, plans: currentPlans, variants: currentPlans };
    });
  }, []);

  const handleRemoveVariantFeature = useCallback((variantIndex, featIndex) => {
    setFormData((prev) => {
      const currentPlans = [...(prev.plans || prev.variants || [])];
      const target = currentPlans[variantIndex];
      target.features = (target.features || []).filter((_, idx) => idx !== featIndex);
      currentPlans[variantIndex] = { ...target };
      return { ...prev, plans: currentPlans, variants: currentPlans };
    });
  }, []);

  const handleApplyVariantBulkFeatures = useCallback((variantIndex, parsedFeatures) => {
    setFormData((prev) => {
      const currentPlans = [...(prev.plans || prev.variants || [])];
      currentPlans[variantIndex] = {
        ...currentPlans[variantIndex],
        features: parsedFeatures,
      };
      return { ...prev, plans: currentPlans, variants: currentPlans };
    });
  }, []);

  const handleCopyFeatures = useCallback((targetIndex, sourceIndex) => {
    setFormData((prev) => {
      const currentPlans = prev.plans || prev.variants || [];
      const source = currentPlans[sourceIndex];
      if (!source) return prev;
      const updatedPlans = [...currentPlans];
      updatedPlans[targetIndex] = {
        ...updatedPlans[targetIndex],
        features: JSON.parse(JSON.stringify(source.features || [])),
      };
      return { ...prev, plans: updatedPlans, variants: updatedPlans };
    });
  }, []);

  // ==========================================
  // IMAGE MANAGEMENT HANDLERS
  // ==========================================

  const startImageUpload = useCallback(
    async (blobUrl, file) => {
      if (!file) return;

      setUploadingMap((prev) => ({ ...prev, [blobUrl]: 0 }));
      setUploadErrorsMap((prev) => {
        const next = { ...prev };
        delete next[blobUrl];
        return next;
      });

      try {
        const uploadedUrl = await uploadPlanImageFile(
          file,
          planId || "custom",
          (progress) => {
            setUploadingMap((prev) => {
              if (prev[blobUrl] === undefined) return prev; // cancelled or removed
              return { ...prev, [blobUrl]: progress };
            });
          }
        );

        // Replace blobUrl with uploaded permanent/optimized URL
        setFormData((prev) => {
          const replaceUrl = (list) =>
            (list || []).map((img) => (img === blobUrl ? uploadedUrl : img));
          return {
            ...prev,
            images: replaceUrl(prev.images),
            imageUrl: replaceUrl(prev.imageUrl),
          };
        });

        // Clean up maps
        setPendingFilesMap((prev) => {
          const next = { ...prev };
          delete next[blobUrl];
          return next;
        });
        setUploadingMap((prev) => {
          const next = { ...prev };
          delete next[blobUrl];
          return next;
        });

        try {
          URL.revokeObjectURL(blobUrl);
        } catch (e) {
          // ignore
        }

        return uploadedUrl;
      } catch (err) {
        console.error("Upload failed for file:", file.name, err);
        setUploadingMap((prev) => {
          const next = { ...prev };
          delete next[blobUrl];
          return next;
        });
        setUploadErrorsMap((prev) => ({
          ...prev,
          [blobUrl]: err.message || "Failed to upload image",
        }));
      }
    },
    [planId]
  );

  const handleFilesSelected = useCallback(
    (filesList) => {
      if (!filesList || filesList.length === 0) return;
      const newBlobs = [];
      const newFiles = {};

      Array.from(filesList).forEach((file) => {
        if (!file.type.startsWith("image/")) return;
        const blobUrl = URL.createObjectURL(file);
        newBlobs.push(blobUrl);
        newFiles[blobUrl] = file;
      });

      if (newBlobs.length > 0) {
        setPendingFilesMap((prev) => ({ ...prev, ...newFiles }));
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...newBlobs],
          imageUrl: [...(prev.imageUrl || prev.images || []), ...newBlobs],
        }));

        // Immediately start uploading each selected image in background with progress
        newBlobs.forEach((blobUrl) => {
          startImageUpload(blobUrl, newFiles[blobUrl]);
        });
      }
    },
    [startImageUpload]
  );

  const handleRetryUpload = useCallback(
    (blobUrl) => {
      const file = pendingFilesMap[blobUrl];
      if (file) {
        startImageUpload(blobUrl, file);
      }
    },
    [pendingFilesMap, startImageUpload]
  );

  const handleAddImage = useCallback((urlToAdd = newImageUrl) => {
    const trimmed = (urlToAdd || "").trim();
    if (!trimmed) return;
    if (formData.images.includes(trimmed)) {
      setNewImageUrl("");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, trimmed],
    }));
    setNewImageUrl("");
  }, [newImageUrl, formData.images]);

  const handleRemoveImage = useCallback((target) => {
    setFormData((prev) => {
      const currentList = Array.isArray(prev?.images)
        ? [...prev.images]
        : Array.isArray(prev?.imageUrl)
        ? [...prev.imageUrl]
        : [];

      let indexToRemove = -1;
      if (typeof target === "number") {
        indexToRemove = target;
      } else if (typeof target === "string") {
        indexToRemove = currentList.findIndex((img) => img === target);
      }

      if (indexToRemove < 0 || indexToRemove >= currentList.length) {
        return prev;
      }

      const urlToRemove = currentList[indexToRemove];
      if (urlToRemove && urlToRemove.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(urlToRemove);
        } catch (e) {
          // ignore
        }
        setPendingFilesMap((p) => {
          const updated = { ...p };
          delete updated[urlToRemove];
          return updated;
        });
        setUploadingMap((p) => {
          const updated = { ...p };
          delete updated[urlToRemove];
          return updated;
        });
        setUploadErrorsMap((p) => {
          const updated = { ...p };
          delete updated[urlToRemove];
          return updated;
        });
      }

      const updatedImages = currentList.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updatedImages,
        imageUrl: updatedImages,
      };
    });
  }, []);

  const handleSetPrimaryImage = useCallback((target) => {
    setFormData((prev) => {
      const currentList = Array.isArray(prev?.images)
        ? [...prev.images]
        : Array.isArray(prev?.imageUrl)
        ? [...prev.imageUrl]
        : [];

      if (!currentList.length) return prev;

      let indexToPromote = -1;
      if (typeof target === "number") {
        indexToPromote = target;
      } else if (typeof target === "string") {
        indexToPromote = currentList.findIndex((img) => img === target);
      }

      if (indexToPromote < 0 || indexToPromote >= currentList.length) {
        return prev;
      }

      const selected = currentList[indexToPromote];
      const rest = currentList.filter((_, idx) => idx !== indexToPromote);
      const updatedImages = [selected, ...rest];

      return {
        ...prev,
        images: updatedImages,
        imageUrl: updatedImages,
      };
    });
  }, []);

  // Computed state for active uploads
  const isUploadingImages = Object.keys(uploadingMap).length > 0;

  // ==========================================
  // SUBMIT HANDLER
  // ==========================================

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError(null);

    if (Object.keys(uploadingMap).length > 0) {
      setError("Please wait for all images to finish uploading before saving.");
      return;
    }

    const serviceTitle = (formData.title || formData.name || "").trim();
    if (!serviceTitle) {
      setError("Please provide a service title.");
      return;
    }

    const plansList = formData.plans || formData.variants || [];
    if (!plansList || plansList.length === 0) {
      setError("Please add at least one duration plan (e.g. 1 Month, 3 Months, or 6 Months).");
      return;
    }

    // Validate all plans under this service
    for (let i = 0; i < plansList.length; i++) {
      const v = plansList[i];
      const calc = variantCalculations[i] || calculateVariantPricing(v);
      const planLabel = v.name || v.duration || `Plan ${i + 1}`;

      if (Number(v.price) <= 0) {
        setError(`Original price for plan "${planLabel}" must be greater than zero.`);
        return;
      }
      if (calc.finalPrice <= 0) {
        setError(`Final price after discount for plan "${planLabel}" must be at least ₹1.`);
        return;
      }
      if (calc.upfrontAmount <= 0 && v.paymentOptions !== "FULL") {
        setError(`Down payment amount for plan "${planLabel}" must be greater than ₹0.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      // 1. Resolve local staged image files to Firebase Storage in parallel (fallback if any remain)
      const resolvedImages = await Promise.all(
        formData.images.map(async (imgUrl) => {
          if (imgUrl.startsWith("blob:") && pendingFilesMap[imgUrl]) {
            const file = pendingFilesMap[imgUrl];
            const uploadedUrl = await uploadPlanImageFile(file, planId || "custom");
            try {
              URL.revokeObjectURL(imgUrl);
            } catch (e) {
              // ignore
            }
            return uploadedUrl;
          }
          return imgUrl;
        })
      );

      // 2. Build complete Service payload with nested plans: []
      const planPayload = buildPlanPayload(
        {
          ...formData,
          title: serviceTitle,
          name: serviceTitle,
          images: resolvedImages,
        },
        { isEditMode }
      );
      await saveCustomPlan(planPayload, isEditMode ? planId : null, currentUser);

      const successMessage = isCloneMode
        ? `Plan "${serviceTitle}" cloned and created successfully.`
        : isEditMode
        ? `Plan "${serviceTitle}" updated successfully.`
        : `Plan "${serviceTitle}" published successfully.`;

      navigate("/admin/plans", {
        state: {
          feedback: {
            type: "success",
            text: successMessage,
          },
        },
      });
    } catch (err) {
      console.error("Error saving service & plans:", err);
      let userMsg = err.message || "Failed to save service details.";
      if (err.code === "storage/unauthorized" || userMsg.includes("storage/unauthorized") || userMsg.includes("User does not have permission")) {
        userMsg = "Firebase Storage permission denied (storage/unauthorized). Please enable read/write in Firebase Console -> Storage -> Rules.";
      }
      setError(userMsg);
    } finally {
      setSubmitting(false);
    }
  }, [formData, variantCalculations, pendingFilesMap, uploadingMap, planId, isEditMode, isCloneMode, currentUser, navigate]);

  return {
    isCloneMode,
    clonedFromTitle,
    formData,
    setFormData,
    services,
    loading,
    submitting,
    error,
    setError,
    previewModalUrl,
    setPreviewModalUrl,
    newImageUrl,
    setNewImageUrl,
    pendingFilesMap,
    uploadingMap,
    isUploadingImages,
    uploadErrorsMap,
    handleRetryUpload,
    handleFilesSelected,
    imageErrorMap,
    setImageErrorMap,
    creatorInfo,
    variantCalculations,
    handleChange,
    handleAddImage,
    handleRemoveImage,
    handleSetPrimaryImage,
    // Duration Variants API
    setSelectedVariantIndex,
    handleAddPresetVariant,
    handleAddCustomVariant,
    handleDuplicateVariant,
    handleRemoveVariant,
    handleUpdateVariant,
    handleAddVariantFeature,
    handleUpdateVariantFeature,
    handleRemoveVariantFeature,
    handleApplyVariantBulkFeatures,
    handleCopyFeatures,
    handleSubmit,
  };
}

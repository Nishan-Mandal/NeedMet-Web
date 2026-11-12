import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Sparkles,
  UploadCloud,
  Loader2,
  Trash2,
  RefreshCw,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  FileImage,
} from "lucide-react";
import { uploadPartnerLogo } from "../../../../services/firebase/storage/partnerLogoService";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export default function PartnerFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingPartner,
  actionLoading,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selectedFileMeta, setSelectedFileMeta] = useState(null); // { name, size }
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setUploadError("");
      setShowUrlInput(false);
      setSelectedFileMeta(null);
    }
  }, [isOpen, editingPartner]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateAndUploadFile = async (file) => {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setUploadError("Invalid format. Please upload PNG, SVG, JPG, or WebP.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError("File size exceeds 5MB. Please choose a smaller logo.");
      return;
    }

    try {
      setUploading(true);
      setUploadError("");
      setSelectedFileMeta({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
      });

      const downloadUrl = await uploadPartnerLogo(file, {
        partnerName: formData.name || "partner",
      });

      setFormData((prev) => ({ ...prev, logo: downloadUrl }));
    } catch (err) {
      console.error("Logo upload failed:", err);
      setUploadError(err.message || "Failed to upload logo image.");
      setSelectedFileMeta(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    validateAndUploadFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    validateAndUploadFile(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, logo: "" }));
    setSelectedFileMeta(null);
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 font-primary animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl my-6 rounded-2xl bg-white shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#e8f5ee] text-[#0f5c3e] flex items-center justify-center font-bold shadow-2xs">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-base leading-tight">
                {editingPartner ? "Edit Brand Partner" : "Add Ecosystem Partner"}
              </h3>
              <p className="text-xs text-slate-500 leading-tight">
                Configure partner details for the brand partner marquee on the homepage.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Form Body ── */}
        <form onSubmit={onSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[82vh]">
          {/* ══════════════════════════════════════════════════════════
              TOP SECTION — Image Upload and Large Preview
             ══════════════════════════════════════════════════════════ */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileImage size={14} className="text-[#0f5c3e]" />
                <span>Partner Logo & Brand Icon *</span>
              </label>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-[11px] font-semibold text-[#0f5c3e] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <LinkIcon size={11} />
                <span>{showUrlInput ? "Use File Upload" : "Paste Image URL"}</span>
              </button>
            </div>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept={ALLOWED_TYPES.join(",")}
              onChange={handleFileInputChange}
              className="hidden"
              id="partner-logo-upload"
            />

            {/* Case 1: Logo is present (Uploaded or URL exists) */}
            {formData.logo ? (
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row items-center sm:items-stretch gap-4 transition-all">
                {/* Large, Clear Image Preview Card */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-white border border-slate-200/90 p-2.5 flex items-center justify-center shrink-0 shadow-xs relative group overflow-hidden">
                  <img
                    src={formData.logo}
                    alt={formData.name || "Partner Logo"}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/120?text=Preview+Error";
                    }}
                  />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 rounded-lg bg-white/90 text-slate-800 hover:bg-white text-xs font-semibold cursor-pointer"
                      title="Replace image"
                    >
                      <RefreshCw size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-semibold cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Details & Actions alongside Preview */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 text-center sm:text-left">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e8f5ee] text-[#0f5c3e] border border-[#d1fae5] mb-1.5">
                      <CheckCircle2 size={11} />
                      <span>Logo Ready</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 truncate">
                      {selectedFileMeta?.name || formData.name ? `${formData.name || "Partner"} Logo` : "Logo Asset"}
                    </h4>
                    {selectedFileMeta?.size && (
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        File Size: {selectedFileMeta.size}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400 truncate max-w-md mt-0.5 font-mono">
                      {formData.logo}
                    </p>
                  </div>

                  {/* Actions: Replace & Remove */}
                  <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
                    >
                      {uploading ? (
                        <>
                          <Loader2 size={12} className="animate-spin text-[#0f5c3e]" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw size={12} />
                          <span>Replace Image</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100/70 text-red-600 text-xs font-semibold transition cursor-pointer"
                    >
                      <Trash2 size={12} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : showUrlInput ? (
              /* Case 2: Direct URL Input mode */
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    name="logo"
                    required
                    value={formData.logo || ""}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.svg or png"
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0f5c3e] focus:ring-2 focus:ring-[#0f5c3e]/20 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer shrink-0"
                  >
                    Or Choose File
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">
                  Tip: Provide a clean SVG or transparent PNG link for crisp rendering in the marquee.
                </p>
              </div>
            ) : (
              /* Case 3: Drag & Drop Upload Zone */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full p-6 sm:p-7 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center select-none ${
                  isDragging
                    ? "border-[#0f5c3e] bg-[#e8f5ee]/40 scale-[1.01]"
                    : "border-slate-200 hover:border-[#0f5c3e] bg-slate-50/60 hover:bg-[#e8f5ee]/10"
                }`}
              >
                {uploading ? (
                  <div className="flex flex-col items-center py-2">
                    <Loader2 size={26} className="animate-spin text-[#0f5c3e] mb-2" />
                    <p className="text-xs font-bold text-slate-800">Uploading and optimizing logo...</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Converting to lightweight WebP format</p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center text-[#0f5c3e] mb-2.5">
                      <UploadCloud size={22} />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Drag & drop partner logo here, or <span className="text-[#0f5c3e] underline">browse</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Supports PNG, SVG, JPG, WebP (Max 5MB)
                    </p>
                  </>
                )}
              </div>
            )}

            {uploadError && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                <AlertCircle size={14} className="shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════════
              BELOW — Partner Name
             ══════════════════════════════════════════════════════════ */}
          <div className="space-y-3.5 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Partner Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name || ""}
                onChange={handleChange}
                placeholder="e.g. Google, Microsoft, Zoho"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0f5c3e] focus:ring-2 focus:ring-[#0f5c3e]/20"
              />
            </div>
          </div>

          {/* ── Modal Footer Actions ── */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading || uploading || !formData.logo}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0f5c3e] hover:bg-[#1a8a5a] text-white shadow-xs transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {actionLoading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : editingPartner ? (
                "Update Partner"
              ) : (
                "Create Partner"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

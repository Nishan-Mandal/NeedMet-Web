import React, { useRef } from "react";
import {
  X,
  Monitor,
  Smartphone,
  Upload,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Check,
} from "lucide-react";
import BannerDevicePreview from "./BannerDevicePreview";

const PRESET_ROUTES = [
  { label: "All Categories", route: "/all_categories" },
  { label: "Recommended Listings", route: "/listings/recommended" },
  { label: "Newly Added", route: "/listings/newly_added" },
  { label: "Restaurants", route: "/listings/category/restaurants" },
  { label: "Salons & Spa", route: "/listings/category/salons" },
  { label: "Doctors & Health", route: "/listings/category/doctors" },
];

export default function BannerFormModal({
  isOpen = false,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingBanner,
  tabMeta,
  saving = false,
  uploadingMobile = false,
  uploadingDesktop = false,
  onFileUpload,
}) {
  const mobileInputRef = useRef(null);
  const desktopInputRef = useRef(null);

  if (!isOpen) return null;

  const Icon = tabMeta?.icon || Monitor;
  const label = tabMeta?.label || "Banners";
  const singularLabel = label.slice(0, -1) || "Banner";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#e8f5ee] text-[#0f5c3e] rounded-xl border border-[#d1fae5]">
              <Icon size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900">
                {editingBanner ? `Edit ${singularLabel}` : `Add New ${singularLabel}`}
              </h3>
              <p className="text-xs text-slate-500">
                Configure responsive graphics, redirect links, and test live viewports.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Banner Name / Label <span className="text-slate-400 font-normal">(Internal)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Diwali Super Savings Promo, Salon 50% Off"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white transition"
                />
              </div>

              {/* Desktop Image Input & Upload */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Monitor size={15} className="text-[#0f5c3e]" />
                    Desktop Image URL (Web)
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">16:4 or 1920x480</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://... desktop banner URL"
                    value={formData.webUrl}
                    onChange={(e) => setFormData({ ...formData, webUrl: e.target.value })}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0f5c3e] transition"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={desktopInputRef}
                    onChange={(e) => onFileUpload(e, "desktop")}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => desktopInputRef.current?.click()}
                    disabled={uploadingDesktop}
                    className="px-3 py-2 bg-white border border-slate-200 hover:border-[#0f5c3e] hover:text-[#0f5c3e] rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    {uploadingDesktop ? (
                      <RefreshCw size={13} className="animate-spin text-[#0f5c3e]" />
                    ) : (
                      <Upload size={13} />
                    )}
                    <span>{uploadingDesktop ? "Uploading..." : "Upload File"}</span>
                  </button>
                </div>
              </div>

              {/* Mobile Image Input & Upload */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Smartphone size={15} className="text-[#0f5c3e]" />
                    Mobile Image URL (Phones)
                  </label>
                  <div className="flex items-center gap-2">
                    {formData.webUrl && !formData.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: formData.webUrl })}
                        className="text-[11px] text-[#0f5c3e] hover:underline font-semibold"
                      >
                        Use Desktop URL
                      </button>
                    )}
                    <span className="text-[11px] text-slate-400 font-mono">16:9 or 14:7</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://... mobile banner URL"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0f5c3e] transition"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={mobileInputRef}
                    onChange={(e) => onFileUpload(e, "mobile")}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => mobileInputRef.current?.click()}
                    disabled={uploadingMobile}
                    className="px-3 py-2 bg-white border border-slate-200 hover:border-[#0f5c3e] hover:text-[#0f5c3e] rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    {uploadingMobile ? (
                      <RefreshCw size={13} className="animate-spin text-[#0f5c3e]" />
                    ) : (
                      <Upload size={13} />
                    )}
                    <span>{uploadingMobile ? "Uploading..." : "Upload File"}</span>
                  </button>
                </div>
              </div>

              {/* Destination Route */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Redirect Destination URL / App Route
                </label>
                <input
                  type="text"
                  placeholder="e.g. /listings/category/salons or https://needmet.com/deals"
                  value={formData.route}
                  onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                  className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white transition"
                />

                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-400">Presets:</span>
                  {PRESET_ROUTES.map((preset) => (
                    <button
                      key={preset.route}
                      type="button"
                      onClick={() => setFormData({ ...formData, route: preset.route })}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-[#e8f5ee] hover:text-[#0f5c3e] text-[11px] text-slate-600 transition cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order & Status */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Display Order Position
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Visibility Status
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                    className={`w-full py-2 px-3 rounded-xl border flex items-center justify-between text-xs font-semibold transition cursor-pointer ${
                      formData.isActive
                        ? "bg-[#e8f5ee] text-[#0f5c3e] border-[#d1fae5]"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    <span>{formData.isActive ? "Active (Visible)" : "Inactive (Hidden)"}</span>
                    {formData.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Live Viewport Previews */}
            <div className="lg:col-span-5">
              <BannerDevicePreview
                webUrl={formData.webUrl}
                imageUrl={formData.imageUrl}
                route={formData.route}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || uploadingMobile || uploadingDesktop}
              className="px-5 py-2 rounded-full bg-[#0f5c3e] hover:bg-[#1a8a5a] text-white font-semibold text-xs shadow-md shadow-emerald-900/15 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw size={14} className="animate-spin text-white" />
              ) : (
                <Check size={14} />
              )}
              <span>{saving ? "Saving Changes..." : editingBanner ? "Save Changes" : "Create Banner"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

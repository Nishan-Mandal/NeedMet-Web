import React from "react";
import { Image as ImageIcon, Trash2 } from "lucide-react";

export default function MediaSocialSection({
  formData,
  setFormData,
  onImageChange,
  onAddImageField,
  onRemoveImageField,
}) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-[#0f5c3e] flex items-center gap-2">
        <ImageIcon size={16} />
        4. Media & Social Presence
      </h2>

      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700">
          Listing Image URLs
        </label>
        {formData.images.map((imgUrl, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="url"
              placeholder="https://... (CDN or hosted image URL)"
              value={imgUrl}
              onChange={(e) => onImageChange(i, e.target.value)}
              className="flex-1 bg-[#f7faf8] border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
            />
            <button
              type="button"
              onClick={() => onRemoveImageField(i)}
              className="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={onAddImageField}
          className="text-xs text-[#0f5c3e] hover:underline font-bold cursor-pointer"
        >
          + Add Image URL
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            WhatsApp
          </label>
          <input
            type="text"
            placeholder="+919876543210"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Website URL
          </label>
          <input
            type="url"
            placeholder="https://example.com"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
          />
        </div>
      </div>
    </div>
  );
}

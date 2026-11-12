import React from "react";
import { MapPin } from "lucide-react";

export default function LocationSection({ formData, setFormData }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-[#0f5c3e] flex items-center gap-2">
        <MapPin size={16} />
        3. Address & Geographical Location
      </h2>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Full Address *
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Shop 14, Hazratganj Main Market, Lucknow, UP 226001"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Latitude (lat)
          </label>
          <input
            type="text"
            value={formData.lat}
            onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
            className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Longitude (lng)
          </label>
          <input
            type="text"
            value={formData.lng}
            onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
            className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white font-mono"
          />
        </div>
      </div>
    </div>
  );
}

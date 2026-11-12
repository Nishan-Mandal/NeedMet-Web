import React from "react";
import { Store } from "lucide-react";

export const POPULAR_CATEGORIES = [
  "Restaurant & Cafe",
  "Doctor & Healthcare",
  "Salons & Spa",
  "Fitness & Gym",
  "Education & Coaching",
  "Real Estate",
  "Automotive & Garage",
  "Shopping & Retail",
  "Home Services",
  "Hotels & Stays",
];

export default function BusinessIdentitySection({ formData, setFormData }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-[#0f5c3e] flex items-center gap-2">
        <Store size={16} />
        1. Business Identity
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Business Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Royal Grand Bakery"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
          >
            {POPULAR_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Business Description
        </label>
        <textarea
          rows="3"
          placeholder="Describe products, services, amenities, and specialties..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
        ></textarea>
      </div>
    </div>
  );
}

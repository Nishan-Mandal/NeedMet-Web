import React from "react";
import { Phone } from "lucide-react";

export default function ContactInfoSection({ formData, setFormData }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-[#0f5c3e] flex items-center gap-2">
        <Phone size={16} />
        2. Contact & Communications
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Primary Phone *
          </label>
          <input
            type="tel"
            required
            placeholder="e.g. +91 9876543210"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Alternate Phone
          </label>
          <input
            type="tel"
            placeholder="Optional backup phone"
            value={formData.alternatePhone}
            onChange={(e) =>
              setFormData({ ...formData, alternatePhone: e.target.value })
            }
            className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Business Email
          </label>
          <input
            type="email"
            placeholder="contact@business.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
          />
        </div>
      </div>
    </div>
  );
}

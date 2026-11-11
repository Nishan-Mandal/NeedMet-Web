import React from "react";
import { ShieldCheck } from "lucide-react";

export default function AdminFlagsSection({ formData, setFormData }) {
  return (
    <div className="p-6 rounded-2xl bg-[#e8f5ee]/50 border border-[#d1fae5] space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-[#0f5c3e] flex items-center gap-2">
        <ShieldCheck size={16} />
        5. Administrative Flags
      </h2>

      <div className="flex flex-col sm:flex-row gap-6">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isVerified}
            onChange={(e) =>
              setFormData({ ...formData, isVerified: e.target.checked })
            }
            className="rounded border-slate-300 text-[#0f5c3e] focus:ring-0 cursor-pointer"
          />
          <div>
            <div className="text-xs font-bold text-slate-900">Verified Business</div>
            <div className="text-[11px] text-slate-500">
              Apply trusted checkmark immediately
            </div>
          </div>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isPremium}
            onChange={(e) =>
              setFormData({ ...formData, isPremium: e.target.checked })
            }
            className="rounded border-slate-300 text-[#0f5c3e] focus:ring-0 cursor-pointer"
          />
          <div>
            <div className="text-xs font-bold text-slate-900">
              Pro / Featured Badge
            </div>
            <div className="text-[11px] text-slate-500">
              Boost in search results
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}

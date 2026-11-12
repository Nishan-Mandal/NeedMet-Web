import React from "react";
import { Link } from "react-router-dom";
import {
  Store,
  Phone,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  XCircle,
  CheckCircle2,
  ExternalLink,
  Trash2,
} from "lucide-react";

export default function ListingItemRow({
  item,
  isActionLoading = false,
  onToggleVerify,
  onDeleteListing,
}) {
  const isVerified = Boolean(item.verifiedBy);
  const firstImage =
    Array.isArray(item.images) && item.images.length > 0
      ? typeof item.images[0] === "string"
        ? item.images[0]
        : item.images[0].thumbUrl || item.images[0].fullUrl
      : null;

  return (
    <tr className="hover:bg-[#e8f5ee]/30 transition">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
            {firstImage ? (
              <img
                src={firstImage}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Store size={18} className="text-slate-400" />
            )}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-slate-900 text-sm truncate flex items-center gap-1.5">
              <span>{item.name}</span>
              {item.isPremium && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
                  PRO
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              ID: {item.id?.slice(0, 10)}...
            </div>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <span className="px-2.5 py-1 rounded-lg bg-[#e8f5ee] text-[#0f5c3e] text-xs font-semibold">
          {item.category || "Unassigned"}
        </span>
      </td>
      <td className="px-5 py-4 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 text-slate-800 font-medium">
          <Phone size={12} className="text-[#0f5c3e]" />
          <span>{item.phone || "No phone"}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 mt-1 truncate max-w-xs">
          <MapPin size={12} className="shrink-0" />
          <span className="truncate">{item.address || "No address"}</span>
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="flex flex-col gap-1">
          {isVerified ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#e8f5ee] text-[#0f5c3e] border border-[#d1fae5] w-max">
              <ShieldCheck size={11} /> Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200 w-max">
              <ShieldAlert size={11} /> Unverified
            </span>
          )}
          {item.isClaimed && (
            <span className="text-[10px] text-blue-600 font-medium">Claimed</span>
          )}
        </div>
      </td>
      <td className="px-5 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          {/* Toggle Verification */}
          <button
            type="button"
            onClick={() => onToggleVerify(item.id, isVerified)}
            disabled={isActionLoading}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1 cursor-pointer ${
              isVerified
                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                : "bg-[#e8f5ee] hover:bg-[#d1fae5] text-[#0f5c3e] border-[#d1fae5]"
            }`}
            title={isVerified ? "Remove verification" : "Approve and verify"}
          >
            {isVerified ? <XCircle size={13} /> : <CheckCircle2 size={13} />}
            <span>{isVerified ? "Unverify" : "Verify"}</span>
          </button>

          {/* Public Link */}
          <Link
            to={`/listing/${item.id}`}
            target="_blank"
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#e8f5ee] hover:text-[#0f5c3e] text-slate-700 border border-slate-200 transition cursor-pointer"
            title="View on Live Site"
          >
            <ExternalLink size={14} />
          </Link>

          {/* Soft Delete */}
          <button
            type="button"
            onClick={() => onDeleteListing(item.id, item.name)}
            disabled={isActionLoading}
            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition cursor-pointer"
            title="Archive Listing"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

import React from "react";
import { Coins, Copy, Clock, Ban, History, UserCheck, ShieldCheck } from "lucide-react";

export default function CashCodeTableSection({
  loading = false,
  codes = [],
  searchQuery = "",
  onCopy,
  onOpenAudit,
  onOpenRevoke,
}) {
  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-sm animate-pulse">
        Loading cash codes from database...
      </div>
    );
  }

  if (codes.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-xs text-slate-500">
        <Coins size={40} className="mx-auto mb-3 text-slate-300" />
        <p className="font-semibold text-slate-800">No cash codes found</p>
        <p className="text-xs text-slate-400 mt-1">
          {searchQuery
            ? "Try refining your search keyword."
            : "Click 'Issue Cash Code' to create store credits."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="bg-[#f7faf8] text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200 font-bold">
          <tr>
            <th className="px-5 py-3.5">Code & Owner</th>
            <th className="px-5 py-3.5">Amount (Credit)</th>
            <th className="px-5 py-3.5">Redemption Status</th>
            <th className="px-5 py-3.5">Expiration</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5 text-right">Details & Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {codes.map((codeItem) => {
            const isRevoked = codeItem.computedStatus === "revoked" || codeItem.status === "revoked";
            const isUsed = Boolean(codeItem.isUsed) || codeItem.computedStatus === "redeemed";
            const isExpired = codeItem.computedStatus === "expired";
            const amountNum = Number(codeItem.amount || codeItem.value || 0);

            // Format expiration date
            const expiresDate = codeItem.expiresAtDate
              ? codeItem.expiresAtDate
              : (codeItem.expiresAt ? new Date(codeItem.expiresAt) : null);
            const expiresFormatted =
              expiresDate && !isNaN(expiresDate.getTime())
                ? expiresDate.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Never";

            // Format used date
            const usedDate = codeItem.usedAtDate
              ? codeItem.usedAtDate
              : (codeItem.usedAt ? new Date(codeItem.usedAt) : null);
            const usedFormatted =
              usedDate && !isNaN(usedDate.getTime())
                ? usedDate.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : null;

            return (
              <tr key={codeItem.id} className="hover:bg-[#e8f5ee]/30 transition">
                {/* Code & Owner */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#0f5c3e] tracking-wider text-sm bg-[#e8f5ee] px-2 py-0.5 rounded border border-[#d1fae5]">
                      {codeItem.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => onCopy(codeItem.code)}
                      className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                      title="Copy Code"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <span className="text-slate-400">Owner:</span>
                    <span className="font-medium text-slate-700">{codeItem.ownerName || "—"}</span>
                  </div>
                  {codeItem.notes && (
                    <div className="text-[11px] text-slate-400 mt-0.5 italic">{codeItem.notes}</div>
                  )}
                </td>

                {/* Amount (Credit) */}
                <td className="px-5 py-4">
                  <div className="font-bold text-[#0f5c3e] text-base">
                    ₹{amountNum.toLocaleString("en-IN")}
                  </div>
                  {codeItem.paymentId && (
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[140px]" title={codeItem.paymentId}>
                      {codeItem.paymentId}
                    </div>
                  )}
                </td>

                {/* Redemption Status */}
                <td className="px-5 py-4 text-xs">
                  {isRevoked ? (
                    <div className="space-y-0.5">
                      <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                        <Ban size={13} />
                        Revoked
                      </span>
                      <div className="text-[11px] text-slate-400">Voided by admin</div>
                    </div>
                  ) : isUsed ? (
                    <div className="space-y-0.5">
                      <span className="inline-flex items-center gap-1 text-sky-700 font-semibold">
                        <UserCheck size={13} />
                        Redeemed
                      </span>
                      {codeItem.usedBy && (
                        <div className="text-[11px] text-slate-500 font-mono truncate max-w-[150px]" title={codeItem.usedBy}>
                          By: {codeItem.usedBy}
                        </div>
                      )}
                      {usedFormatted && (
                        <div className="text-[11px] text-slate-400">On: {usedFormatted}</div>
                      )}
                    </div>
                  ) : isExpired ? (
                    <div className="space-y-0.5">
                      <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                        <Clock size={13} className="text-amber-600" />
                        Expired
                      </span>
                      <div className="text-[11px] text-slate-400">Validity lapsed</div>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <ShieldCheck size={13} className="text-emerald-600" />
                        Available
                      </span>
                      <div className="text-[11px] text-slate-400">Unused credit</div>
                    </div>
                  )}
                </td>

                {/* Expiration */}
                <td className="px-5 py-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock
                      size={13}
                      className={isExpired ? "text-red-500" : "text-slate-400"}
                    />
                    <span className={isExpired ? "text-red-600 font-semibold" : "text-slate-700 font-medium"}>
                      {expiresFormatted}
                    </span>
                  </div>
                  {isExpired && (
                    <span className="text-[10px] text-red-500 font-bold block mt-0.5">Expired</span>
                  )}
                </td>

                {/* Status Badge */}
                <td className="px-5 py-4">
                  {isRevoked ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-600 border border-red-200 flex items-center gap-1 w-max">
                      <Ban size={11} /> Revoked
                    </span>
                  ) : isUsed ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                      Redeemed
                    </span>
                  ) : isExpired ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      Expired
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#e8f5ee] text-[#0f5c3e] border border-[#d1fae5]">
                      Active
                    </span>
                  )}
                </td>

                {/* Audit & Actions */}
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenAudit(codeItem)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#e8f5ee] hover:text-[#0f5c3e] text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition cursor-pointer"
                      title="View Code Details & Audit"
                    >
                      <History size={13} />
                      <span>Details</span>
                    </button>

                    {!isRevoked && !isUsed && (
                      <button
                        type="button"
                        onClick={() => onOpenRevoke(codeItem)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition cursor-pointer"
                        title="Revoke code"
                      >
                        <Ban size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

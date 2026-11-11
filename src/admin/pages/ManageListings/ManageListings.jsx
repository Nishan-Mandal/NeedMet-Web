import { useState, useEffect } from "react";
import { adminApi } from "../../services/adminApi";
import ActionHeader from "../../components/ActionHeader";
import {
  ListingsTableSection,
  ListingsPaginationSection,
} from "./Sections";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function ManageListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const loadListings = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await adminApi.getListings({
        page,
        limit: 15,
        search: debouncedSearch,
        category: categoryFilter,
        status: statusFilter,
      });

      if (res?.success) {
        setListings(res.listings || []);
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalCount(res.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Error loading listings:", err);
      setErrorMsg(err.message || "Failed to retrieve listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, [page, statusFilter, categoryFilter, debouncedSearch]);

  const handleToggleVerify = async (listingId, currentlyVerified) => {
    try {
      setActionLoadingId(listingId);
      setErrorMsg("");
      const res = await adminApi.toggleVerifyListing(listingId);
      if (res?.success) {
        setListings((prev) =>
          prev.map((l) =>
            l.id === listingId ? { ...l, verifiedBy: res.isVerified ? "admin" : null } : l
          )
        );
        setSuccessMsg(res.message);
        setTimeout(() => setSuccessMsg(""), 2500);
      }
    } catch (err) {
      console.error("Verify toggle error:", err);
      setErrorMsg(err.message || "Failed to update verification status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteListing = async (listingId, name) => {
    if (
      !window.confirm(
        `Are you sure you want to remove "${name}"? This listing will be archived.`
      )
    ) {
      return;
    }

    try {
      setActionLoadingId(listingId);
      setErrorMsg("");
      await adminApi.deleteListing(listingId);
      setListings((prev) => prev.filter((l) => l.id !== listingId));
      setSuccessMsg(`Listing "${name}" successfully archived.`);
      setTimeout(() => setSuccessMsg(""), 2500);
    } catch (err) {
      console.error("Delete listing error:", err);
      setErrorMsg(err.message || "Failed to delete listing.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 w-full font-primary">
      {/* Unified Action & Filter Toolbar */}
      <ActionHeader
        filters={["all", "verified", "unverified", "claimed"]}
        activeFilter={statusFilter}
        onFilterChange={(st) => {
          setStatusFilter(st);
          setPage(1);
        }}
        searchPlaceholder="Search business name, phone, address..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={loadListings}
        refreshing={loading}
        actionLabel="Add New Listing"
        actionTo="/admin/listings/new"
      />

      {/* Alerts */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg("")}
            className="text-red-500 hover:text-red-800 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-[#e8f5ee] border border-[#d1fae5] text-[#0f5c3e] text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMsg("")}
            className="text-[#0f5c3e] hover:opacity-75 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Listings Table Section */}
      <ListingsTableSection
        loading={loading}
        listings={listings}
        searchQuery={debouncedSearch}
        actionLoadingId={actionLoadingId}
        onToggleVerify={handleToggleVerify}
        onDeleteListing={handleDeleteListing}
      />

      {/* Pagination Section */}
      <ListingsPaginationSection
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}

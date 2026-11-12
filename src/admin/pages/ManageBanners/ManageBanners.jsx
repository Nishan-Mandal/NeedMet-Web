import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Sparkles,
  Images,
  Layers,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import ActionHeader from "../../components/ActionHeader";
import {
  BannerListSection,
  BannerFormModal,
  BannerStandalonePreviewModal,
} from "./Sections";
import {
  getHomeDocument,
  saveBanners,
  toggleBannerStatus,
  reorderBanners,
  deleteBanner,
} from "../../services/homeBannerService";
import { uploadBannerImage } from "../../../services/firebase/storage/bannerImageService";

const TAB_CONFIG = [
  {
    id: "promoBanners",
    label: "Promo Banners",
    description: "Promotional hero & high-impact event banners",
    icon: Sparkles,
  },
  {
    id: "banners",
    label: "Home Banners",
    description: "Category dividers & homepage showcase banners",
    icon: Images,
  },
  {
    id: "posters",
    label: "Posters",
    description: "Spotlight cards & vertical marketing posters",
    icon: Layers,
  },
];

export default function ManageBanners() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "promoBanners";
  const [activeTab, setActiveTab] = useState(
    ["promoBanners", "banners", "posters"].includes(initialTab) ? initialTab : "promoBanners"
  );

  const [docId, setDocId] = useState(null);
  const [collections, setCollections] = useState({
    promoBanners: [],
    banners: [],
    posters: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [saving, setSaving] = useState(false);

  // Standalone Preview Modal State
  const [previewItem, setPreviewItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    imageUrl: "",
    webUrl: "",
    route: "",
    order: 0,
    isActive: true,
  });

  // Upload States
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);

  // Synchronize Tab with URL query
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    setSearchQuery("");
  };

  // Fetch Firestore Home Document
  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const result = await getHomeDocument();
      setDocId(result.docId);
      setCollections({
        promoBanners: result.promoBanners || [],
        banners: result.banners || [],
        posters: result.posters || [],
      });
    } catch (err) {
      console.error("Failed to load banners:", err);
      setErrorMsg(err.message || "Unable to fetch banners from Firestore.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Current list for the active tab
  const currentItems = collections[activeTab] || [];

  // Filtered Items based on search and status
  const filteredItems = useMemo(() => {
    return currentItems.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.route && item.route.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.webUrl && item.webUrl.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.imageUrl && item.imageUrl.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.isActive !== false) ||
        (statusFilter === "inactive" && item.isActive === false);

      return matchesSearch && matchesStatus;
    });
  }, [currentItems, searchQuery, statusFilter]);

  // Statistics
  const totalCount = currentItems.length;
  const activeCount = currentItems.filter((i) => i.isActive !== false).length;
  const inactiveCount = totalCount - activeCount;

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingBanner(null);
    setFormData({
      id: "",
      title: "",
      imageUrl: "",
      webUrl: "",
      route: "",
      order: currentItems.length,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditingBanner(item);
    setFormData({
      id: item.id || "",
      title: item.title || "",
      imageUrl: item.imageUrl || item.image || "",
      webUrl: item.webUrl || item.weburl || "",
      route: item.route || item.redirectUrl || "",
      order: typeof item.order === "number" ? item.order : 0,
      isActive: item.isActive !== false,
    });
    setIsModalOpen(true);
  };

  // Toggle Active/Inactive Status
  const handleToggleStatus = async (item) => {
    try {
      const newStatus = !item.isActive;
      const updatedList = await toggleBannerStatus({
        docId,
        type: activeTab,
        items: currentItems,
        bannerId: item.id,
        newStatus,
      });

      setCollections((prev) => ({
        ...prev,
        [activeTab]: updatedList,
      }));

      setSuccessMsg(`Banner "${item.title || "item"}" is now ${newStatus ? "Active" : "Inactive"}.`);
    } catch (err) {
      console.error("Status toggle error:", err);
      setErrorMsg("Failed to update banner status. Please try again.");
    }
  };

  // Reorder Handlers
  const handleMove = async (index, direction) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentItems.length) return;

    const reordered = [...currentItems];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    try {
      const persisted = await reorderBanners({
        docId,
        type: activeTab,
        items: reordered,
      });

      setCollections((prev) => ({
        ...prev,
        [activeTab]: persisted,
      }));
    } catch (err) {
      console.error("Reordering error:", err);
      setErrorMsg("Failed to persist banner ordering.");
    }
  };

  // Delete Banner
  const handleDelete = async (item) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${item.title || "this banner"}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      const updatedList = await deleteBanner({
        docId,
        type: activeTab,
        items: currentItems,
        bannerId: item.id,
      });

      setCollections((prev) => ({
        ...prev,
        [activeTab]: updatedList,
      }));

      setSuccessMsg("Banner removed successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      setErrorMsg("Failed to delete banner.");
    }
  };

  // Handle Image File Uploads
  const handleFileUpload = async (event, targetType) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (targetType === "mobile") setUploadingMobile(true);
    if (targetType === "desktop") setUploadingDesktop(true);

    try {
      const downloadUrl = await uploadBannerImage(file, {
        target: targetType,
        category: activeTab,
      });

      setFormData((prev) => ({
        ...prev,
        [targetType === "mobile" ? "imageUrl" : "webUrl"]: downloadUrl,
      }));
      setSuccessMsg(`${targetType === "mobile" ? "Mobile" : "Desktop"} image uploaded successfully.`);
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg(`Failed to upload ${targetType} image: ${err.message}`);
    } finally {
      if (targetType === "mobile") setUploadingMobile(false);
      if (targetType === "desktop") setUploadingDesktop(false);
      event.target.value = "";
    }
  };

  // Save Form (Create or Edit)
  const handleSaveForm = async (e) => {
    e.preventDefault();

    if (!formData.imageUrl && !formData.webUrl) {
      setErrorMsg("Please provide at least a Mobile or Desktop image URL.");
      return;
    }

    setSaving(true);
    setErrorMsg("");

    try {
      let updatedItems = [...currentItems];

      if (editingBanner) {
        updatedItems = updatedItems.map((b) => (b.id === editingBanner.id ? { ...formData } : b));
      } else {
        const newBanner = {
          ...formData,
          id: `b_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          order: currentItems.length,
        };
        updatedItems.push(newBanner);
      }

      const savedList = await saveBanners({
        docId,
        type: activeTab,
        items: updatedItems,
      });

      setCollections((prev) => ({
        ...prev,
        [activeTab]: savedList,
      }));

      setIsModalOpen(false);
      setSuccessMsg(
        editingBanner ? "Banner updated successfully." : "New banner created successfully."
      );
    } catch (err) {
      console.error("Save error:", err);
      setErrorMsg(`Failed to save banner: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const currentTabMeta = TAB_CONFIG.find((t) => t.id === activeTab) || TAB_CONFIG[0];

  return (
    <div className="space-y-5 w-full font-primary">
      {/* Unified Action & Filter Toolbar using ActionHeader */}
      <ActionHeader
        filters={[
          {
            label: "Promo Banners",
            value: "promoBanners",
            count: collections.promoBanners.length,
          },
          {
            label: "Home Banners",
            value: "banners",
            count: collections.banners.length,
          },
          {
            label: "Posters",
            value: "posters",
            count: collections.posters.length,
          },
        ]}
        activeFilter={activeTab}
        onFilterChange={handleTabChange}
        searchPlaceholder={`Search ${currentTabMeta.label.toLowerCase()} by title, route, or URL...`}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={loadData}
        refreshing={loading}
        actionLabel={`Add ${currentTabMeta.label.slice(0, -1) || "Banner"}`}
        onActionClick={handleOpenCreate}
      >
        {/* Status Filter Pill in Brand Colors */}
        <div className="flex items-center bg-white p-1 rounded-full border border-slate-200/90 shadow-xs shrink-0">
          {["all", "active", "inactive"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-[#0f5c3e] text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </ActionHeader>

      {/* Notification Alerts */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg("")}
            className="text-red-400 hover:text-red-700 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-[#e8f5ee] border border-[#d1fae5] text-[#0f5c3e] text-sm flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="shrink-0 text-[#0f5c3e]" />
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

      {/* Banner Card Listing */}
      <BannerListSection
        loading={loading}
        items={filteredItems}
        tabMeta={currentTabMeta}
        searchQuery={searchQuery}
        onOpenCreate={handleOpenCreate}
        onMove={handleMove}
        onToggleStatus={handleToggleStatus}
        onPreview={(item) => setPreviewItem(item)}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* Create / Edit Form Modal with Live Device Preview */}
      <BannerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveForm}
        formData={formData}
        setFormData={setFormData}
        editingBanner={editingBanner}
        tabMeta={currentTabMeta}
        saving={saving}
        uploadingMobile={uploadingMobile}
        uploadingDesktop={uploadingDesktop}
        onFileUpload={handleFileUpload}
      />

      {/* Standalone Live Viewport Preview Modal */}
      <BannerStandalonePreviewModal
        previewItem={previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </div>
  );
}

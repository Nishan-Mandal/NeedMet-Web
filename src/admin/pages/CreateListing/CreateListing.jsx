import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminApi } from "../../services/adminApi";
import {
  BusinessIdentitySection,
  ContactInfoSection,
  LocationSection,
  MediaSocialSection,
  AdminFlagsSection,
} from "./Sections";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function CreateListing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "Restaurant & Cafe",
    address: "",
    phone: "",
    alternatePhone: "",
    email: "",
    description: "",
    lat: "26.8467",
    lng: "80.9462",
    images: [""],
    isVerified: true,
    isPremium: false,
    ownerName: "Verified Merchant",
    whatsapp: "",
    instagram: "",
    facebook: "",
    website: "",
  });

  const handleImageChange = (index, val) => {
    const updated = [...formData.images];
    updated[index] = val;
    setFormData({ ...formData, images: updated });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const removeImageField = (index) => {
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        alternatePhone: formData.alternatePhone.trim(),
        email: formData.email.trim(),
        description: formData.description.trim(),
        geo: {
          lat: parseFloat(formData.lat) || 0.0,
          lng: parseFloat(formData.lng) || 0.0,
        },
        images: formData.images.filter((img) => img.trim() !== ""),
        social: {
          whatsapp: formData.whatsapp.trim(),
          instagram: formData.instagram.trim(),
          facebook: formData.facebook.trim(),
          website: formData.website.trim(),
        },
        isVerified: formData.isVerified,
        isPremium: formData.isPremium,
        ownerName: formData.ownerName.trim(),
      };

      const res = await adminApi.createListing(payload);
      if (res?.success) {
        setSuccessMsg(
          `Listing "${formData.name}" created successfully! Redirecting...`
        );
        setTimeout(() => {
          navigate("/admin/listings");
        }, 1500);
      }
    } catch (err) {
      console.error("Error creating listing:", err);
      setErrorMsg(err.message || "Failed to create listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full font-primary">
      {/* Back Action Bar */}
      <div className="flex items-center justify-between pb-1">
        <Link
          to="/admin/listings"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition shadow-xs text-xs font-semibold"
        >
          <ArrowLeft size={16} />
          <span>Back to Listings</span>
        </Link>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-[#e8f5ee] border border-[#d1fae5] text-[#0f5c3e] text-sm flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form with Sections */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Business Identity */}
        <BusinessIdentitySection
          formData={formData}
          setFormData={setFormData}
        />

        {/* 2. Contact Information */}
        <ContactInfoSection
          formData={formData}
          setFormData={setFormData}
        />

        {/* 3. Address & Geographical Location */}
        <LocationSection
          formData={formData}
          setFormData={setFormData}
        />

        {/* 4. Media & Social Presence */}
        <MediaSocialSection
          formData={formData}
          setFormData={setFormData}
          onImageChange={handleImageChange}
          onAddImageField={addImageField}
          onRemoveImageField={removeImageField}
        />

        {/* 5. Administrative Flags */}
        <AdminFlagsSection
          formData={formData}
          setFormData={setFormData}
        />

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/admin/listings"
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-200 transition shadow-xs"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[#0f5c3e] hover:bg-[#1a8a5a] text-white font-bold text-sm shadow-md shadow-emerald-900/10 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {loading ? "Creating..." : "Publish Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}

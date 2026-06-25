import { Listing, Geo, DaySchedule } from "../../../data/model/listingModel";

export const buildListingFromFormData = ({
  formData,
  listingId,
  uploadedImages,
}) => {
  const filteredDetailFields = (formData.detailFields || []).filter(
    (f) => f.key.trim() && f.value.trim()
  );

  const details = {
    ...Object.fromEntries(
      filteredDetailFields.map((f) => [f.key.trim(), f.value.trim()])
    ),
    "Accept Online Payments": String(formData.onlinePayments),
  };

  const detailsOrder = [
    ...filteredDetailFields.map((f) => f.key.trim()),
    "Accept Online Payments",
  ];

  return new Listing({
    listingId,
    addedBy: formData.addedBy,
    name: formData.shopName,
    ownerName: formData.ownerName,
    address: formData.address,
    phone: formData.phone,
    alternatePhone: formData.altPhone || "",
    email: formData.email || "",
    category: formData.category,
    description: formData.description || "",
    since: Number(formData.since) || new Date().getFullYear(),
    geo: new Geo(formData.geo),
    tags: formData.tags || [],
    businessHours: Object.fromEntries(
      Object.entries(formData.hours || {}).map(([day, value]) => [
        day,
        DaySchedule.fromJson(value),
      ])
    ),
    details,
    detailsOrder,
    social: {
      instagram: formData.instagram || "",
      facebook: formData.facebook || "",
      website: formData.website || "",
      linkedin: formData.linkedin || "",
      whatsapp: formData.whatsapp || "",
    },
    images: uploadedImages,
  });
};
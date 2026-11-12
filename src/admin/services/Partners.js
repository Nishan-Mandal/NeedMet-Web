import { apiRequest } from "./apiClient";

export const getPartners = async (status = "all") => {
  try {
    return await apiRequest(`/partners?status=${status}`, { method: "GET" });
  } catch (err) {
    if (err.status !== 404) throw err;
    const { getPartners: getPartnersService } = await import("../../services/partnerService");
    const partners = await getPartnersService(status);
    return { success: true, partners };
  }
};

export const createPartner = async (data) => {
  try {
    return await apiRequest("/partners", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (err) {
    if (err.status !== 404) throw err;
    const { createPartner: createPartnerService } = await import("../../services/partnerService");
    const partner = await createPartnerService(data);
    return { success: true, partner };
  }
};

export const updatePartner = async (id, data) => {
  try {
    return await apiRequest(`/partners/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  } catch (err) {
    if (err.status !== 404) throw err;
    const { updatePartner: updatePartnerService } = await import("../../services/partnerService");
    const partner = await updatePartnerService(id, data);
    return { success: true, partner };
  }
};

export const deletePartner = async (id) => {
  try {
    return await apiRequest(`/partners/${id}`, { method: "DELETE" });
  } catch (err) {
    if (err.status !== 404) throw err;
    const { deletePartner: deletePartnerService } = await import("../../services/partnerService");
    await deletePartnerService(id);
    return { success: true, id };
  }
};

export const togglePartner = async (id, currentStatus) => {
  try {
    return await apiRequest(`/partners/${id}/toggle`, { method: "PATCH" });
  } catch (err) {
    if (err.status !== 404) throw err;
    const { togglePartnerStatus } = await import("../../services/partnerService");
    return await togglePartnerStatus(id, currentStatus);
  }
};

export const reorderPartners = async (orderedPartners) => {
  const { reorderPartners: reorderPartnersService } = await import("../../services/partnerService");
  const updated = await reorderPartnersService(orderedPartners);
  return { success: true, partners: updated };
};

export default {
  getPartners,
  createPartner,
  updatePartner,
  deletePartner,
  togglePartner,
  reorderPartners,
};


import {
  generateListingRef,
  saveListing,
} from "../firestore/listingService";
import { uploadListingImages } from "../storage/listingImageService";
import { buildListingFromFormData } from "./listingBuilder";
import { ImageFile } from "../../../data/model/listingModel";

export const createListingPipeline = async (
  formData,
  onImageProgress = () => {}
) => {
  try {
    // 1) Generate Firestore doc ref first
    const newRef = generateListingRef();
    const listingId = newRef.id;

    // 2) Upload images under this listingId
    let uploadedImages = [];
    if (formData.images?.length) {
      const rawUploadedImages = await uploadListingImages(
          formData.images,
          listingId,
          onImageProgress
      );

      uploadedImages = rawUploadedImages.map((img) => new ImageFile(img));
    }

    // 3) Build listing model
    const listing = buildListingFromFormData({
      formData,
      listingId,
      uploadedImages,
    });

    // 4) Save to Firestore
    await saveListing(listingId, listing.toJson());

    return listingId;
  } catch (error) {
    console.error("Error in createListingPipeline:", error);
    throw error;
  }
};
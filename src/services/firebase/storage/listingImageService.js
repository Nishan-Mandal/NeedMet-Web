import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../../../firebase/firebaseConfig";
import { compressImage } from "../../../utils/imageCompression";

/**
 * Upload one listing image:
 * - create full image
 * - create thumbnail
 * - upload both to Firebase Storage
 * - return Firestore image object
 */
export async function uploadSingleListingImage(file, listingId) {
  const fileId = uuidv4();

  // 1) Create compressed full image
  const fullImage = await compressImage(file, {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 1280,
    fileType: "image/webp",
    initialQuality: 0.8,
  });

  // 2) Create compressed thumbnail image
  const thumbImage = await compressImage(file, {
    maxSizeMB: 0.05,
    maxWidthOrHeight: 300,
    fileType: "image/webp",
    initialQuality: 0.6,
  });

  // 3) Create storage refs
  const fullRef = ref(storage, `listings/${listingId}/full_${fileId}.webp`);
  const thumbRef = ref(storage, `listings/${listingId}/thumb_${fileId}.webp`);

  // 4) Upload both compressed images
  await Promise.all([
    uploadBytes(fullRef, fullImage, { contentType: "image/webp" }),
    uploadBytes(thumbRef, thumbImage, { contentType: "image/webp" }),
  ]);

  // 5) Get download URLs
  const [fullUrl, thumbUrl] = await Promise.all([
    getDownloadURL(fullRef),
    getDownloadURL(thumbRef),
  ]);

  // 6) Return exactly the shape your NeedMet listing model expects
  return {
    fileId,
    fullUrl,
    thumbUrl,
  };
}

/**
 * Upload multiple listing images
 */
export async function uploadListingImages(imageItems, listingId, onImageProgress) {
  const total = imageItems.length;
  let completed = 0;

  const results = await Promise.all(
    imageItems.map(async (img) => {
      const result = await uploadSingleListingImage(img.file, listingId);

      completed += 1;
      onImageProgress?.(completed, total);

      return result;
    })
  );

  return results;
}
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";

/**
 * Compresses an image File using an offscreen canvas and returns an optimized data URL.
 * Produces a ~30-70KB compact base64 string suitable for direct storage fallback.
 */
export const fileToOptimizedDataUrl = (file, maxWidth = 1200, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("No file provided"));

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert large PNGs to JPEG for substantial size reduction
        const isPng = file.type === "image/png";
        const targetMime = isPng && file.size > 250000 ? "image/jpeg" : (file.type || "image/jpeg");
        const dataUrl = canvas.toDataURL(targetMime, quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Failed to load image for compression."));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });
};

/**
 * Uploads an image file to Firebase Storage under plans/ folder.
 * Supports progress tracking and gracefully falls back to an optimized inline image if Storage rules are not yet deployed.
 *
 * @param {File} file - The image file to upload
 * @param {string} planId - Identifier for the plan folder
 * @param {Function} [onProgress] - Optional callback receiving progress percentage (0 - 100)
 * @returns {Promise<string>} Public download URL or fallback data URL
 */
export const uploadPlanImageFile = async (file, planId = "custom", onProgress = null) => {
  if (!file) throw new Error("No file provided for upload.");

  const sanitizedName = (file.name || "image").replace(/[^a-zA-Z0-9.-]/g, "_");
  const uniqueName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${sanitizedName}`;
  const storageRef = ref(storage, `plans/${planId}/${uniqueName}`);

  return new Promise((resolve, reject) => {
    try {
      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type || "image/jpeg",
      });

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          if (snapshot.totalBytes > 0 && typeof onProgress === "function") {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            onProgress(progress);
          }
        },
        async (err) => {
          const isUnauthorized =
            err?.code === "storage/unauthorized" ||
            err?.message?.includes("unauthorized") ||
            err?.message?.includes("User does not have permission");

          if (isUnauthorized) {
            console.warn(
              "⚠️ Firebase Storage permission denied (storage/unauthorized). " +
              "Saving image as an optimized inline fallback so your changes are not blocked. " +
              "To enable Firebase Storage uploads, update your Storage Security Rules in Firebase Console."
            );

            try {
              if (typeof onProgress === "function") onProgress(65);
              const fallbackDataUrl = await fileToOptimizedDataUrl(file);
              if (typeof onProgress === "function") onProgress(100);
              resolve(fallbackDataUrl);
            } catch (fallbackErr) {
              console.error("Failed to generate fallback data URL:", fallbackErr);
              reject(
                new Error(
                  "Firebase Storage upload blocked by permission rules (storage/unauthorized). " +
                  "Please update your Firebase Storage Rules in the Firebase Console."
                )
              );
            }
            return;
          }

          reject(err);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (typeof onProgress === "function") onProgress(100);
            resolve(downloadUrl);
          } catch (e) {
            reject(e);
          }
        }
      );
    } catch (immediateErr) {
      reject(immediateErr);
    }
  });
};


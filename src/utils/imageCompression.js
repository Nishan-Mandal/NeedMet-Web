import imageCompression from "browser-image-compression";


export async function compressImage(
  file,
  {
    maxSizeMB = 1,
    maxWidthOrHeight = 1280,
    fileType = "image/webp",
    initialQuality = 0.8,
  } = {}
) {
  const options = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    fileType,
    initialQuality,
  };

  const compressedFile = await imageCompression(file, options);
  return compressedFile;
}
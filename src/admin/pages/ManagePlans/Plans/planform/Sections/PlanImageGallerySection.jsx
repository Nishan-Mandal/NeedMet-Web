import { useState, useRef } from "react";

export default function PlanImageGallerySection({
  images = [],
  pendingFilesMap = {},
  uploadingMap = {},
  isUploadingImages = false,
  uploadErrorsMap = {},
  onRetryUpload,
  onFilesSelected,
  onRemoveImage,
  onSetPrimaryImage,
  onPreviewImage,
  imageErrorMap = {},
  onImageError,
  isExpanded = true,
  onToggleExpand,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const activeUploadCount = Object.keys(uploadingMap).length;

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isUploadingImages) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploadingImages) return;
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      e.target.value = "";
    }
  };

  return (
    <div className="rounded-2xl sm:rounded-xl border border-gray-200/70 bg-white p-4 sm:p-4 shadow-2xs space-y-3.5 sm:space-y-3 text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-gray-100 flex-wrap gap-2">
        <button
          type="button"
          onClick={onToggleExpand}
          className="flex items-center gap-1.5 text-left group cursor-pointer"
        >
          <div className="space-y-0.5">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-1.5 group-hover:text-[#266C51] transition">
              <span className="material-symbols-outlined text-[#266C51] text-lg sm:text-base">
                perm_media
              </span>
              Service Media & Gallery
            </h2>
            <p className="text-xs sm:text-[11px] text-gray-500">
              First image serves as the main storefront cover.
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {activeUploadCount > 0 && (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 sm:py-0.5 text-xs sm:text-[11px] font-bold text-emerald-700 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Uploading {activeUploadCount}...
            </span>
          )}
          <span className="rounded-md bg-gray-100 px-2.5 py-1 sm:py-0.5 text-xs sm:text-[11px] font-semibold text-gray-600">
            {images.length} {images.length === 1 ? "Image" : "Images"}
          </span>
          {onToggleExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="inline-flex items-center justify-center h-8 w-8 sm:h-7 sm:w-7 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300 transition cursor-pointer"
              title={isExpanded ? "Collapse section" : "Expand section"}
              aria-label={isExpanded ? "Collapse section" : "Expand section"}
            >
              <span className="material-symbols-outlined text-lg sm:text-base">
                {isExpanded ? "expand_less" : "expand_more"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Collapsed State Preview */}
      {!isExpanded && (
        <div
          onClick={onToggleExpand}
          className="flex items-center justify-between text-xs text-gray-600 bg-gray-50/70 rounded-xl p-3 cursor-pointer hover:bg-gray-100/70 transition border border-gray-100"
        >
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-gray-800">
              {images.length > 0
                ? `${images.length} image${images.length > 1 ? "s" : ""} uploaded`
                : "No media uploaded"}
            </span>
            {images.length > 0 && (
              <div className="flex items-center -space-x-1.5">
                {images.slice(0, 4).map((img, i) => (
                  <img
                    key={i}
                    src={typeof img === "string" ? img : img?.url}
                    alt=""
                    className="h-6 w-6 rounded-md object-cover border border-white shadow-2xs"
                  />
                ))}
                {images.length > 4 && (
                  <span className="text-[10px] text-gray-500 font-bold pl-2">
                    +{images.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>
          <span className="text-[11px] text-[#266C51] font-bold shrink-0 ml-2">Tap to expand</span>
        </div>
      )}

      {/* Dropzone with Active Upload State */}
      {isExpanded && (
        <>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploadingImages && fileInputRef.current?.click()}
            className={`group flex items-center justify-center gap-3 rounded-xl sm:rounded-lg border border-dashed px-4 py-4 sm:py-3 text-center transition-all ${
              isUploadingImages
                ? "border-emerald-400 bg-emerald-50/40 cursor-wait"
                : isDragging
                ? "border-[#266C51] bg-emerald-50/60 cursor-pointer"
                : "border-gray-300 bg-gray-50/50 hover:border-[#266C51] hover:bg-emerald-50/30 cursor-pointer"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              disabled={isUploadingImages}
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div
              className={`flex h-10 w-10 sm:h-8 sm:w-8 items-center justify-center rounded-xl sm:rounded-lg transition-colors shrink-0 ${
                isUploadingImages
                  ? "bg-emerald-100 text-[#266C51]"
                  : "bg-emerald-50 text-[#266C51] group-hover:bg-emerald-100"
              }`}
            >
              <span
                className={`material-symbols-outlined text-xl sm:text-lg ${
                  isUploadingImages ? "animate-spin text-emerald-600" : ""
                }`}
              >
                {isUploadingImages ? "progress_activity" : "cloud_upload"}
              </span>
            </div>

            <div className="text-left text-sm sm:text-xs">
              {isUploadingImages ? (
                <div>
                  <span className="font-bold text-emerald-900 block sm:inline">
                    Uploading {activeUploadCount} file{activeUploadCount > 1 ? "s" : ""}...
                  </span>
                  <span className="text-xs sm:text-[11px] text-emerald-700 block">
                    Optimizing & storing securely to cloud storage
                  </span>
                </div>
              ) : (
                <div>
                  <span className="font-semibold text-gray-800">
                    Tap to upload or drag images here, or{" "}
                  </span>
                  <span className="font-bold text-[#266C51] underline underline-offset-2">
                    browse
                  </span>
                  <span className="text-xs sm:text-[11px] text-gray-400 block sm:inline sm:ml-2">
                    PNG, JPG, WebP up to 10MB
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Flat Image Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 pt-1">
              {images.map((imgUrl, idx) => {
                const isPrimary = idx === 0;
                const hasError = imageErrorMap[imgUrl];
                const isBlob = imgUrl.startsWith("blob:");
                const isUploading = uploadingMap[imgUrl] !== undefined;
                const progress = uploadingMap[imgUrl] || 0;
                const uploadError = uploadErrorsMap[imgUrl];

                const displayName = isBlob
                  ? pendingFilesMap[imgUrl]?.name || `Image ${idx + 1}`
                  : imgUrl.split("/").pop()?.split("?")[0] || `Image ${idx + 1}`;

                return (
                  <div
                    key={`${imgUrl}-${idx}`}
                    className={`group relative aspect-[4/3] rounded-lg overflow-hidden border transition-all ${
                      isUploading
                        ? "border-emerald-400 ring-2 ring-emerald-300/50 shadow-xs"
                        : uploadError
                        ? "border-red-400 ring-2 ring-red-300/40"
                        : isPrimary
                        ? "border-[#266C51] ring-2 ring-[#266C51]/20 shadow-xs"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {/* Media Image */}
                    {!hasError ? (
                      <img
                        src={imgUrl}
                        alt={`Media ${idx + 1}`}
                        onError={() => onImageError && onImageError(imgUrl)}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-1 bg-red-50 text-red-500">
                        <span className="material-symbols-outlined text-xl">
                          broken_image
                        </span>
                        <span className="text-[10px]">Failed</span>
                      </div>
                    )}

                    {/* 1. UPLOADING LOADER OVERLAY */}
                    {isUploading && (
                      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/65 backdrop-blur-[2px] p-2 text-white text-center">
                        <div className="relative flex items-center justify-center">
                          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-400" />
                          {progress > 0 && (
                            <span className="absolute text-[9px] font-bold text-emerald-200">
                              {progress}%
                            </span>
                          )}
                        </div>
                        <span className="mt-1 text-[10px] font-bold text-emerald-100 tracking-wide">
                          Uploading...
                        </span>
                        <div className="mt-1 h-1 w-14 overflow-hidden rounded-full bg-white/20">
                          <div
                            className="h-full bg-emerald-400 transition-all duration-300 rounded-full"
                            style={{ width: `${Math.max(12, progress)}%` }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onRemoveImage(idx);
                          }}
                          title="Cancel upload"
                          className="mt-1.5 text-[9px] text-gray-300 hover:text-white underline cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {/* 2. UPLOAD ERROR OVERLAY */}
                    {uploadError && !isUploading && (
                      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-red-950/80 backdrop-blur-[2px] p-2 text-white text-center">
                        <span className="material-symbols-outlined text-red-300 text-lg">
                          warning
                        </span>
                        <span className="text-[10px] font-bold text-red-200 leading-tight">
                          Upload Failed
                        </span>
                        <div className="mt-2 flex items-center gap-1.5">
                          {onRetryUpload && pendingFilesMap[imgUrl] && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onRetryUpload(imgUrl);
                              }}
                              className="rounded bg-white px-2 py-0.5 text-[9px] font-bold text-gray-900 shadow hover:bg-gray-100 cursor-pointer"
                            >
                              Retry
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onRemoveImage(idx);
                            }}
                            className="rounded bg-red-600 px-2 py-0.5 text-[9px] font-bold text-white shadow hover:bg-red-700 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 3. NORMAL STATE */}
                    {!isUploading && !uploadError && (
                      <>
                        {/* Cover Badge / Button */}
                        <div className="absolute top-1.5 left-1.5 z-10">
                          {isPrimary ? (
                            <span className="flex items-center gap-1 rounded bg-[#266C51] px-2 py-0.5 sm:px-1.5 sm:py-0.5 text-[10px] sm:text-[9px] font-bold text-white shadow-xs">
                              <span className="material-symbols-outlined text-xs sm:text-[10px]">
                                star
                              </span>
                              Cover
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onSetPrimaryImage(idx);
                              }}
                              title="Set as main cover image"
                              className="flex items-center gap-1 rounded bg-black/70 hover:bg-[#266C51] px-2 py-0.5 sm:px-1.5 sm:py-0.5 text-[10px] sm:text-[9px] font-semibold text-white opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition shadow-xs cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-xs sm:text-[10px] text-amber-300">
                                star
                              </span>
                              Cover
                            </button>
                          )}
                        </div>

                        {/* Preview Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onPreviewImage(imgUrl);
                          }}
                          title="Expand preview"
                          className="absolute top-1.5 right-1.5 z-10 flex h-7 w-7 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm sm:text-xs">
                            visibility
                          </span>
                        </button>

                        {/* Delete Button */}
                        <div className="absolute bottom-1.5 right-1.5 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:bg-black/35 sm:opacity-0 sm:backdrop-blur-[1px] transition-opacity duration-150 sm:group-hover:opacity-100 z-10">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onRemoveImage(idx);
                            }}
                            title="Remove image"
                            className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-red-600/90 text-white shadow-md hover:bg-red-700 transition cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm sm:text-lg">
                              delete
                            </span>
                          </button>
                        </div>

                        {/* Bottom Filename */}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 py-1 text-[10px] sm:text-[9px] text-white font-medium truncate pointer-events-none hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="truncate block" title={displayName}>
                            {displayName}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ImageUploader({
  images,
  onAdd,
  onRemove,
  maxFiles = 20,
  maxSizeMB = 20,
}) {
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);

    const remainingSlots = maxFiles - (images?.length || 0);
    const filesToProcess = files.slice(0, remainingSlots);

    const validFiles = filesToProcess.filter(
      (file) =>
        file.type.startsWith("image/") &&
        file.size <= maxSizeMB * 1024 * 1024
    );

    Promise.all(
      validFiles.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();

            reader.onload = (ev) => {
              resolve({
                src: ev.target.result,
                name: file.name,
                file,
              });
            };

            reader.readAsDataURL(file);
          })
      )
    ).then((newImages) => {
      onAdd(newImages); // send all images together
    });

    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col items-center justify-center gap-2 py-8 px-5 border-2 border-dashed border-border rounded-xl bg-background-secondary cursor-pointer text-center transition-colors text-text-secondary hover:border-primary-light hover:bg-primary-surface hover:text-primary">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFiles}
          hidden
        />

        <div className="text-text-secondary">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" />
            <path
              d="M21 15l-5-5L5 21"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <p className="text-[14.5px] font-medium text-text m-0">
          Drop images here or <span className="text-primary font-semibold">browse</span>
        </p>

        <p className="text-xs text-text-secondary m-0">
          JPG, PNG, WEBP · max {maxSizeMB}MB · up to {maxFiles} images
        </p>
      </label>

      {images?.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2.5">
          {images.map((img, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-[1.5px] border-border bg-surface">
              <img src={img.src} alt={img.name} className="w-full h-full object-cover" />

              {i === 0 && (
                <span className="absolute bottom-1.5 left-1.5 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Cover
                </span>
              )}

              <button
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full border-none bg-black/60 hover:bg-accent-red text-white text-base cursor-pointer flex items-center justify-center transition-colors leading-none"
                onClick={() => onRemove(i)}
                type="button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
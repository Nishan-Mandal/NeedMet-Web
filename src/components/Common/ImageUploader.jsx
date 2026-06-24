import styles from "../../style/Common/ImageUploader.module.css";

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
    <div className={styles.wrapper}>
      <label className={styles.uploadBox}>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFiles}
          hidden
        />

        <div className={styles.icon}>
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

        <p className={styles.title}>
          Drop images here or <span>browse</span>
        </p>

        <p className={styles.sub}>
          JPG, PNG, WEBP · max {maxSizeMB}MB · up to {maxFiles} images
        </p>
      </label>

      {images?.length > 0 && (
        <div className={styles.grid}>
          {images.map((img, i) => (
            <div key={i} className={styles.card}>
              <img src={img.src} alt={img.name} />

              {i === 0 && <span className={styles.cover}>Cover</span>}

              <button
                className={styles.remove}
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
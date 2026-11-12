export default function ImagePreviewModal({ url, onClose }) {
  if (!url) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition cursor-pointer"
          aria-label="Close preview"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Clean Image View (No bulky card wrappers or borders) */}
        <div className="overflow-hidden rounded-xl shadow-2xl bg-black/40 max-h-[82vh] flex items-center justify-center">
          <img
            src={url}
            alt="Image Preview"
            className="max-h-[80vh] w-auto max-w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}

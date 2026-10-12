// variant = page, button, skeleton
const spinnerSizes = {
  sm: "w-3 h-3 border-2",
  md: "w-4 h-4 border-2",
  lg: "w-5 h-5 border-2",
};

export function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={`animate-pulse bg-slate-200/90 rounded-xl ${className}`}
      role="status"
      aria-label="Loading content..."
      {...props}
    />
  );
}

export default function Loader({
  variant = "page",
  size = "md",
  text = "Loading…",
  className = "",
  ...props
}) {
  if (variant === "skeleton") {
    return <Skeleton className={className} {...props} />;
  }

  if (variant === "button") {
    return (
      <span
        className={`inline-block shrink-0 rounded-full border-black/30 border-t-primary-surface animate-spin align-middle ${
          spinnerSizes[size] || spinnerSizes.md
        } ${className}`}
        role="status"
        aria-label="Loading"
        {...props}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity"
      role="status"
      aria-label={text}
    >
      <div className="flex flex-col items-center justify-center gap-4 bg-white border border-slate-200/80 rounded-2xl  shadow-2xl min-w-[120px] min-h-[120px] text-center">
        <span className="block w-10 h-10 rounded-full border-[3px] border-emerald-100 border-t-primary animate-spin" />
        {text && (
          <p className="m-0 text-sm font-medium text-slate-600 tracking-wide whitespace-nowrap">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
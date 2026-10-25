import { useEffect, useRef } from "react";

const icons = {
  success: (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.5 10.5l2.5 2.5 4.5-5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7 7l6 6M13 7l-6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" fill="none">
      <path
        d="M9.13 3.6L2.26 15a1 1 0 00.87 1.5h13.74a1 1 0 00.87-1.5L10.87 3.6a1 1 0 00-1.74 0z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 8.5v3.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="10" cy="14.5" r="0.75" fill="currentColor" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 9v5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="10" cy="6.5" r="0.75" fill="currentColor" />
    </svg>
  ),
  regular: (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 9v5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="10" cy="6.5" r="0.75" fill="currentColor" />
    </svg>
  ),
};

const typeStyles = {
  success: "bg-green-50 border-green-200 text-primary",
  error: "bg-red-50 border-red-200 text-red-700",
  warning: "bg-amber-50 border-amber-200 text-amber-700",
  info: "bg-blue-50 border-blue-200 text-blue-700",
  regular: "bg-primary border-transparent text-white",
};

const progressColors = {
  success: "bg-primary",
  error: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
  regular: "bg-white",
};

export default function Toast({ id, message, type = "info", duration = 3000, onClose }) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const timer = setTimeout(() => {
      onCloseRef.current(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, id]);

  return (
    <div
      className={`pointer-events-auto relative flex items-center justify-between gap-3 w-full sm:min-w-[300px] sm:max-w-[400px] p-3.5 sm:px-4 sm:py-3.5 rounded-xl border shadow-lg overflow-hidden ${
        typeStyles[type] || typeStyles.info
      }`}
      role="alert"
    >
      <span className="shrink-0 w-5 h-5 flex items-center justify-center">
        {icons[type] || icons.info}
      </span>

      <p className="flex-1 m-0 text-sm font-medium leading-snug text-inherit">
        {message}
      </p>

      <button
        className="shrink-0 flex items-center justify-center w-6 h-6 rounded-md bg-transparent hover:bg-black/10 text-inherit cursor-pointer p-0 border-none transition-colors"
        onClick={() => onClose(id)} 
        aria-label="Dismiss"
      >
        <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5">
          <path
            d="M4 4l8 8M12 4l-8 8"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <span
        className={`absolute bottom-0 left-0 h-[3px] w-full origin-left ${progressColors[type] || progressColors.info}`}
        style={{
          animation: `shrink ${duration}ms linear forwards`,
        }}
      />
    </div>
  );
}

export function ToastContainer({ children }) {
  return (
    <div className="fixed top-4 sm:top-5 right-3 sm:right-5 left-3 sm:left-auto z-[99999] flex flex-col gap-2.5 pointer-events-none">
      {children}
    </div>
  );
}
import { useEffect, useRef } from "react";
import styles from "../../style/Common/Toast.module.css";

/**
 * Toast Component
 *
 * Props:
 * - message  : string                                (required)
 * - type     : "success" | "error" | "warning" | "info"  (default: "info")
 * - duration : number in ms                          (default: 3000)
 * - onClose  : () => void                            (required)
 */

const icons = {
  success: (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 10.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" fill="none">
      <path d="M9.13 3.6L2.26 15a1 1 0 00.87 1.5h13.74a1 1 0 00.87-1.5L10.87 3.6a1 1 0 00-1.74 0z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 8.5v3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="10" cy="14.5" r="0.75" fill="currentColor" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 9v5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="10" cy="6.5" r="0.75" fill="currentColor" />
    </svg>
  ),
  regular: (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 9v5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="10" cy="6.5" r="0.75" fill="currentColor" />
    </svg>
  )
};

export default function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
}) {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(onClose, duration);
    return () => clearTimeout(timerRef.current);
  }, [duration, onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`} role="alert">
      <span className={styles.icon}>{icons[type]}</span>
      <p className={styles.message}>{message}</p>
      <button
        className={styles.close}
        onClick={onClose}
        aria-label="Dismiss"
      >
        <svg viewBox="0 0 16 16" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </button>
      <span className={styles.progress} style={{ animationDuration: `${duration}ms` }} />
    </div>
  );
}


/* ─────────────────────────────────────────
  ToastContainer — mounts toasts top-right
  Usage:
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };
  const removeToast = (id) =>
    setToasts(prev => prev.filter(t => t.id !== id));
  return (
    <ToastContainer>
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
      ))}
    </ToastContainer>
  );
───────────────────────────────────────── */
export function ToastContainer({ children }) {
  return <div className={styles.container}>{children}</div>;
}
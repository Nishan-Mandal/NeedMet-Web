import styles from "../../style/Common/Loader.module.css";

export default function Loader({
  variant = "page",
  size = "md",
  text = "Loading…",
}) {
  if (variant === "button") {
    return (
      <span
        className={`${styles.spinner} ${styles[size]}`}
        role="status"
        aria-label="Loading"
      />
    );
  }

  return (
    <div className={styles.overlay} role="status" aria-label={text}>
      <div className={styles.card}>
        <span className={styles.spinnerLg} />
        {text && <p className={styles.text}>{text}</p>}
      </div>
    </div>
  );
}
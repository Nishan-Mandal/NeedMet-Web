import styles from "../style/SectionCard.module.css";

export default function SectionCard({
  step,
  title,
  subtitle,
  icon,
  children,
}) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div className={styles.sectionIcon}>
          {icon}
        </div>

        <div>
          <div className={styles.sectionStep}>
            Step {step}
          </div>

          <h2 className={styles.sectionTitle}>
            {title}
          </h2>

          {subtitle && (
            <p className={styles.sectionSub}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className={styles.sectionBody}>
        {children}
      </div>
    </div>
  );
}
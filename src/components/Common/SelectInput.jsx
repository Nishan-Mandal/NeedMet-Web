import { useState } from "react";
import styles from "../../style/Common/SelectInput.module.css";

export default function SelectInput({
  label,
  id,
  value,
  onChange,
  children,
  placeholder = "",
  required = false,
  disabled = false,
  error,
  icon,
}) {
  const [focused, setFocused] = useState(false);

  const floating = focused || (value && value.length > 0);

  return (
    <div className={styles.fieldWrap}>
      <div
        className={`${styles.box} ${focused ? styles.boxFocused : ""} ${
          error ? styles.boxErr : ""
        } ${disabled ? styles.boxDisabled : ""}`}
      >
        {icon && <span className={styles.icon}>{icon}</span>}

        <div className={styles.inner}>
          <label
            htmlFor={id}
            className={`${styles.label} ${floating ? styles.labelUp : ""}`}
          >
            {label} {required && <span className={styles.req}>*</span>}
          </label>

          <select
            id={id}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            className={`${styles.select} ${floating ? styles.selectActive : ""}`}
          >
            <option value="">{placeholder}</option>
            {children}
          </select>
        </div>

        <span className={styles.chevron}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
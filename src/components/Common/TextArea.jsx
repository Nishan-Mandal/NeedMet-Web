import { useState } from "react";
import styles from "../../style/Common/TextArea.module.css";

export default function TextArea({
  label,
  id,
  name,
  value,
  onChange,
  placeholder = "",
  helper,
  error,
  disabled = false,
  required = false,
  rows = 5,
  maxLength,
  ...props
}) {
  const [focused, setFocused] = useState(false);

  const filled =
    value !== undefined &&
    value !== null &&
    String(value).length > 0;

  const floating = focused || filled;

  return (
    <div
      className={`${styles.fieldWrap} ${
        error ? styles.fieldError : ""
      }`}
    >
      <div
        className={`
          ${styles.box}
          ${focused ? styles.boxFocused : ""}
          ${error ? styles.boxErr : ""}
        `}
      >
        <div className={styles.inner}>
          <label
            htmlFor={id || name}
            className={`${styles.lbl} ${
              floating ? styles.lblUp : ""
            }`}
          >
            {label}
            {required && (
              <span className={styles.req}> *</span>
            )}
          </label>

          <textarea
            id={id || name}
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            maxLength={maxLength}
            placeholder={floating ? placeholder : ""}
            disabled={disabled}
            required={required}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`${styles.textarea} ${
              floating ? styles.textareaActive : ""
            }`}
            {...props}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <div>
          {error ? (
            <p className={styles.errMsg}>{error}</p>
          ) : (
            helper && (
              <p className={styles.helperMsg}>{helper}</p>
            )
          )}
        </div>

        {maxLength && (
          <span className={styles.counter}>
            {value?.length || 0}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
import { useState } from "react";
import styles from "../../style/Common/TextInput.module.css";

export default function TextInput({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  helper,
  error,
  disabled = false,
  required = false,
  icon,
  rightIcon,
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
          ${disabled ? styles.boxDisabled : ""}
        `}
      >
        {icon && <span className={styles.icon}>{icon}</span>}

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

          <input
            id={id || name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={floating ? placeholder : ""}
            disabled={disabled}
            required={required}
            className={`${styles.inp} ${
              floating ? styles.inpActive : ""
            }`}
            {...props}
          />
        </div>

        {rightIcon && (
          <span className={styles.icon}>
            {rightIcon}
          </span>
        )}
      </div>

      {error && (
        <p className={styles.errMsg}>{error}</p>
      )}

      {!error && helper && (
        <p className={styles.helperMsg}>{helper}</p>
      )}
    </div>
  );
}
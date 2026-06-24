import styles from "../../style/Common/ToggleSwitch.module.css";

export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  name,
  ...props
}) {
  return (
    <label className={styles.switch}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />

      <span className={styles.slider}></span>
    </label>
  );
}
export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  name,
  ...props
}) {
  return (
    <label
      className={`relative inline-block w-[50px] h-[28px] select-none ${
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only peer"
        {...props}
      />

      <span className="absolute inset-0 rounded-full transition-colors duration-250 bg-slate-200 peer-checked:bg-primary peer-disabled:cursor-not-allowed before:content-[''] before:absolute before:w-[22px] before:h-[22px] before:left-[3px] before:top-[3px] before:rounded-full before:bg-white before:shadow-sm before:transition-transform before:duration-250 peer-checked:before:translate-x-[22px]" />
    </label>
  );
}
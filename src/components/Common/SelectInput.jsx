import { useState } from "react";

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
    <div className="flex flex-col gap-1.5">
      <div
        className={`relative flex items-center gap-2.5 px-3.5 h-14 border-[1.5px] rounded-xl bg-surface transition-all ${
          error
            ? "border-accent-red"
            : focused
            ? "border-primary shadow-[0_0_0_3px_rgba(15,92,62,0.12)]"
            : "border-border hover:border-primary-light"
        } ${disabled ? "opacity-60 cursor-not-allowed bg-background-secondary" : ""}`}
      >
        {icon && <span className="flex items-center text-text-secondary">{icon}</span>}

        <div className="relative flex-1 h-full flex items-center">
          <label
            htmlFor={id}
            className={`absolute left-0 transition-all pointer-events-none ${
              floating
                ? "top-2 text-[10.5px] font-bold text-primary uppercase tracking-wider"
                : "top-1/2 -translate-y-1/2 text-[14.5px] text-text-secondary"
            }`}
          >
            {label} {required && <span className="text-accent-red font-bold">*</span>}
          </label>

          <select
            id={id}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            className={`w-full h-full border-none outline-none bg-transparent text-[14.5px] font-medium appearance-none cursor-pointer ${
              floating ? "text-text pt-4" : "text-text-secondary pt-0"
            }`}
          >
            <option value="">{placeholder}</option>
            {children}
          </select>
        </div>

        <span className="pointer-events-none text-text-secondary">
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

      {error && <p className="text-xs text-accent-red m-0 pl-1">{error}</p>}
    </div>
  );
}
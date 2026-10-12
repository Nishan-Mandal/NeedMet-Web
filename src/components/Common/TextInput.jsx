import { useState } from "react";

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
    <div className="flex flex-col gap-1.5">
      <div
        className={`relative flex items-center gap-2.5 h-14 px-3.5 bg-surface border-[1.5px] rounded-xl transition-all cursor-text ${
          error
            ? "border-accent-red! ring-[3.5px] ring-red-500/10!"
            : focused
            ? "border-primary ring-[3.5px] ring-primary/10"
            : "border-border hover:border-primary-light"
        } ${disabled ? "bg-background-secondary opacity-60 cursor-not-allowed" : ""}`}
      >
        {icon && (
          <span className={`flex items-center shrink-0 transition-colors ${focused ? "text-primary" : "text-text-secondary"}`}>
            {icon}
          </span>
        )}

        <div className="relative flex-1 h-full flex items-center">
          <label
            htmlFor={id || name}
            className={`absolute left-0 pointer-events-none whitespace-nowrap leading-none transition-all ${
              floating
                ? `top-2 text-[10.5px] font-bold tracking-wider uppercase ${error ? "text-accent-red!" : "text-primary!"}`
                : "top-1/2 -translate-y-1/2 text-[14.5px] font-normal text-text-secondary"
            }`}
          >
            {label}
            {required && <span className="text-accent-red font-bold"> *</span>}
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
            className={`w-full h-full border-none outline-none bg-transparent font-primary text-[14.5px] font-medium text-text caret-primary p-0 disabled:cursor-not-allowed ${
              floating ? "pt-3.5" : ""
            } placeholder:text-text-secondary`}
            {...props}
          />
        </div>

        {rightIcon && (
          <span className={`flex items-center shrink-0 transition-colors ${focused ? "text-primary" : "text-text-secondary"}`}>
            {rightIcon}
          </span>
        )}
      </div>

      {error && (
        <p className="m-0 pl-1 text-xs font-medium text-accent-red leading-normal">{error}</p>
      )}

      {!error && helper && (
        <p className="m-0 pl-1 text-xs text-text-secondary leading-normal">{helper}</p>
      )}
    </div>
  );
}
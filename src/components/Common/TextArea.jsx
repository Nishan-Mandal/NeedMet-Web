import { useState } from "react";

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
    <div className="flex flex-col gap-1.5">
      <div
        className={`relative border-[1.5px] rounded-xl bg-surface transition-all ${
          error
            ? "border-accent-red! ring-[3.5px] ring-red-500/10!"
            : focused
            ? "border-primary ring-[3.5px] ring-primary/10"
            : "border-border hover:border-primary-light"
        }`}
      >
        <div className="relative px-3.5">
          <label
            htmlFor={id || name}
            className={`absolute left-3.5 pointer-events-none transition-all ${
              floating
                ? `top-2 text-[10.5px] font-bold tracking-wider uppercase ${error ? "text-accent-red!" : "text-primary!"}`
                : "top-5 text-[14.5px] font-normal text-text-secondary"
            }`}
          >
            {label}
            {required && <span className="text-accent-red font-bold"> *</span>}
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
            className={`w-full border-none outline-none resize-y bg-transparent font-primary text-[14.5px] font-medium text-text caret-primary min-h-[120px] pb-3.5 leading-relaxed placeholder:text-text-secondary disabled:cursor-not-allowed ${
              floating ? "pt-6" : "pt-5"
            }`}
            {...props}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          {error ? (
            <p className="m-0 pl-1 text-xs font-medium text-accent-red leading-normal">{error}</p>
          ) : (
            helper && (
              <p className="m-0 pl-1 text-xs text-text-secondary leading-normal">{helper}</p>
            )
          )}
        </div>

        {maxLength && (
          <span className="text-xs text-text-secondary">
            {value?.length || 0}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
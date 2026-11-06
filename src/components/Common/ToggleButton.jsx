import React from "react";

/**
 * Reusable animated iOS/Modern-style Toggle Switch Component.
 * Supports native checkbox semantics, accessibility, sizes, and labels.
 */
export default function ToggleButton({
  checked = false,
  onChange,
  name,
  id,
  label,
  description,
  disabled = false,
  size = "sm",
  className = "",
  ...props
}) {
  const sizeStyles = {
    sm: {
      track: "w-8 h-4",
      thumb: "w-3 h-3 left-0.5 top-0.5",
      translate: "translate-x-4",
      labelText: "text-xs",
    },
    md: {
      track: "w-11 h-6",
      thumb: "w-5 h-5 left-0.5 top-0.5",
      translate: "translate-x-5",
      labelText: "text-sm",
    },
    lg: {
      track: "w-14 h-7",
      thumb: "w-6 h-6 left-0.5 top-0.5",
      translate: "translate-x-7",
      labelText: "text-base",
    },
  };

  const currentSize = sizeStyles[size] || sizeStyles.sm;

  return (
    <label
      className={`inline-flex items-center gap-2 select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      <div className="relative inline-flex items-center shrink-0">
        <input
          type="checkbox"
          id={id || name}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        {/* Switch Track */}
        <div
          className={`${currentSize.track} rounded-full transition-colors duration-200 ease-in-out ${
            checked ? "bg-[#266C51]" : "bg-gray-300"
          }`}
        />
        {/* Switch Thumb Knob */}
        <div
          className={`absolute rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out transform ${
            currentSize.thumb
          } ${checked ? currentSize.translate : "translate-x-0"}`}
        />
      </div>

      {label && (
        <div className="flex flex-col text-left">
          <span
            className={`font-semibold text-gray-700 leading-tight ${currentSize.labelText}`}
          >
            {label}
          </span>
          {description && (
            <span className="text-[10px] text-gray-400 leading-tight mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}


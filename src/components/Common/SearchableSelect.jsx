import { useEffect, useMemo, useRef, useState } from "react";

export default function SearchableSelect({
  id,
  label,
  required = false,
  error,
  helperText,
  value,
  onChange,
  onBlur,
  options = [],
  loading = false,
  disabled = false,
  placeholder = "",
  searchPlaceholder = "Search...",
  getOptionLabel = (item) => item?.label ?? "",
  getOptionValue = (item) => item?.value ?? "",
  getOptionImage = (item) => item?.image ?? "",
  noOptionsText = "No options found",
  icon = null,
}) {
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const selectingRef = useRef(false);
  const selectedLabelRef = useRef("");

  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [search, setSearch] = useState("");

  const normalizedOptions = useMemo(() => {
    return options.map((item) => ({
      raw: item,
      label: getOptionLabel(item),
      value: getOptionValue(item),
      image: getOptionImage(item),
    }));
  }, [options, getOptionLabel, getOptionValue, getOptionImage]);

  const selectedOption = useMemo(() => {
    return normalizedOptions.find((item) => item.value === value) || null;
  }, [normalizedOptions, value]);

  const hasValue = !!selectedOption || !!search;

  useEffect(() => {
    const label = selectedOption?.label || "";
    selectedLabelRef.current = label;

    if (!open && !selectingRef.current) {
      setSearch(label);
    }
  }, [selectedOption, open]);

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return normalizedOptions;

    return normalizedOptions.filter((item) =>
      item.label.toLowerCase().includes(q)
    );
  }, [normalizedOptions, search]);

  const closeDropdown = () => {
    setOpen(false);
    setFocused(false);
    setSearch(selectedLabelRef.current || "");
  };

  const handleFocus = () => {
    if (disabled || loading) return;
    setFocused(true);
    setOpen(true);
  };

  const handleInputChange = (e) => {
    if (disabled || loading) return;
    setSearch(e.target.value);
    if (!open) setOpen(true);
  };

  const handleSelect = (item) => {
    selectingRef.current = true;
    selectedLabelRef.current = item.label;

    onChange?.(item.value, item.raw);
    setSearch(item.label);
    setOpen(false);
    setFocused(false);

    requestAnimationFrame(() => {
      selectingRef.current = false;
    });
  };

  const handleBoxClick = () => {
    if (disabled || loading) return;
    inputRef.current?.focus();
    setOpen(true);
    setFocused(true);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        closeDropdown();
        onBlur?.();
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [onBlur]);

  return (
    <div ref={wrapperRef} className="flex flex-col gap-1.5 w-full">
      <div
        className={`relative flex items-center gap-2.5 min-h-14 px-3.5 bg-surface border-[1.5px] rounded-xl transition-all cursor-text ${
          error
            ? "border-accent-red shadow-[0_0_0_3.5px_rgba(239,68,68,0.09)]"
            : focused
            ? "border-primary shadow-[0_0_0_3.5px_rgba(15,92,62,0.11)]"
            : "border-border hover:border-primary-light"
        } ${disabled ? "bg-background-secondary opacity-60 cursor-not-allowed" : ""}`}
        onClick={handleBoxClick}
      >
        {icon && (
          <span
            className={`flex items-center shrink-0 transition-colors ${
              focused ? "text-primary" : "text-text-secondary"
            }`}
          >
            {icon}
          </span>
        )}

        {selectedOption?.image && (
          <img
            src={selectedOption.image}
            alt={selectedOption.label}
            className="w-7 h-7 rounded-lg object-cover shrink-0"
          />
        )}

        <div className="relative flex-1 min-h-14 flex items-center">
          <label
            htmlFor={id}
            className={`absolute left-0 whitespace-nowrap leading-none pointer-events-none transition-all ${
              hasValue || focused
                ? "top-2 text-[10.5px] font-bold text-primary uppercase tracking-wider"
                : "top-1/2 -translate-y-1/2 text-[14.5px] font-normal text-text-secondary"
            } ${error && (hasValue || focused) ? "!text-accent-red" : ""}`}
          >
            {label}
            {required && <span className="text-accent-red font-bold"> *</span>}
          </label>

          <input
            ref={inputRef}
            id={id}
            type="text"
            className={`w-full h-full border-none outline-none bg-transparent text-[14.5px] font-medium text-text caret-primary placeholder:text-text-secondary disabled:cursor-not-allowed ${
              hasValue || focused ? "pt-4" : "p-0"
            }`}
            value={search}
            placeholder={focused ? searchPlaceholder : placeholder}
            onFocus={handleFocus}
            onChange={handleInputChange}
            onBlur={() => {
              if (!selectingRef.current) {
                setFocused(false);
                onBlur?.();
              }
            }}
            disabled={disabled || loading}
            autoComplete="off"
          />
        </div>

        <span
          className={`flex items-center shrink-0 transition-all ${
            open ? "rotate-180 text-primary" : "text-text-secondary"
          }`}
          aria-hidden="true"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        {open && !disabled && !loading && (
          <div className="absolute top-[calc(100%+8px)] left-0 right-0 max-h-60 overflow-y-auto z-40 bg-surface border border-border rounded-2xl shadow-xl p-1.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`w-full border-none bg-transparent text-left cursor-pointer p-2.5 rounded-xl flex items-center gap-2.5 text-sm font-medium transition-colors ${
                    item.value === value
                      ? "bg-primary-surface text-primary"
                      : "text-text hover:bg-primary-surface hover:text-primary"
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(item);
                  }}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.label}
                      className="w-8 h-8 rounded-lg object-cover shrink-0 border border-border p-1"
                    />
                  )}

                  <span className="flex-1 min-w-0">{item.label}</span>
                </button>
              ))
            ) : (
              <div className="p-3 text-[13px] text-text-secondary">{noOptionsText}</div>
            )}
          </div>
        )}
      </div>

      {error ? (
        <p className="m-0 pl-1 text-xs font-medium leading-normal text-accent-red">{error}</p>
      ) : helperText ? (
        <p className="m-0 pl-1 text-xs leading-normal text-text-secondary">{helperText}</p>
      ) : null}
    </div>
  );
}
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "../../style/Common/SearchableSelect.module.css";

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
    <div
      ref={wrapperRef}
      className={`${styles.fieldWrap} ${error ? styles.fieldError : ""}`}
    >
      <div
        className={[
          styles.box,
          focused ? styles.boxFocused : "",
          error ? styles.boxErr : "",
          disabled ? styles.boxDisabled : "",
        ].join(" ")}
        onClick={handleBoxClick}
      >
        {icon && <span className={styles.icon}>{icon}</span>}

        {selectedOption?.image && (
          <img
            src={selectedOption.image}
            alt={selectedOption.label}
            className={styles.selectedImage}
          />
        )}

        <div className={styles.inner}>
          <label
            htmlFor={id}
            className={`${styles.lbl} ${hasValue || focused ? styles.lblUp : ""}`}
          >
            {label}
            {required && <span className={styles.req}> *</span>}
          </label>

          <input
            ref={inputRef}
            id={id}
            type="text"
            className={`${styles.inp} ${hasValue || focused ? styles.inpActive : ""}`}
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
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
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
          <div className={styles.dropdown}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`${styles.option} ${
                    item.value === value ? styles.optionActive : ""
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
                      className={styles.optionImage}
                    />
                  )}

                  <span className={styles.optionLabel}>{item.label}</span>
                </button>
              ))
            ) : (
              <div className={styles.empty}>{noOptionsText}</div>
            )}
          </div>
        )}
      </div>

      {error ? (
        <p className={styles.errMsg}>{error}</p>
      ) : helperText ? (
        <p className={styles.helperMsg}>{helperText}</p>
      ) : null}
    </div>
  );
}
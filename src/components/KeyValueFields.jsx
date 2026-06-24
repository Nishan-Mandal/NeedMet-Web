import styles from "../style/KeyValueFields.module.css";

const ArrowIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function KeyValueFields({
  fields,
  register,
  append,
  remove,
  name = "detailFields",
  keyPlaceholder = "Label",
  valuePlaceholder = "Value",
  addButtonText = "Add another detail",
}) {
  return (
    <>
      <div className={styles.kvList}>
        {fields.map((field, index) => (
          <div key={field.id} className={styles.kvRow}>
            {/* <span className={styles.kvIndex}>
              {index + 1}
            </span> */}

            <div className={styles.kvInputWrap}>
              <input
                className={styles.kvInput}
                placeholder={keyPlaceholder}
                {...register(`${name}.${index}.key`)}
              />
            </div>

            <span className={styles.kvDivider}>
              {/* <ArrowIcon /> */}
              :
            </span>

            <div className={styles.kvInputWrap}>
              <input
                className={styles.kvInput}
                placeholder={valuePlaceholder}
                {...register(`${name}.${index}.value`)}
              />
            </div>

            {fields.length > 1 && (
              <button
                type="button"
                className={styles.kvRemove}
                onClick={() => remove(index)}
              >
                <CloseIcon />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        className={styles.kvAdd}
        onClick={() =>
          append({
            key: "",
            value: "",
          })
        }
      >
        <PlusIcon />
        {addButtonText}
      </button>
    </>
  );
}
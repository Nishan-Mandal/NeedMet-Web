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
      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-1 sm:gap-2 transition-all">
            <div className="flex-1 min-w-0">
              <input
                className="w-full h-[42px] px-3.5 border border-border rounded-xl bg-surface text-text text-sm outline-none transition-all placeholder:text-text-secondary hover:border-primary-light focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder={keyPlaceholder}
                {...register(`${name}.${index}.key`)}
              />
            </div>

            <span className="text-primary font-bold px-1">
              :
            </span>

            <div className="flex-1 min-w-0">
              <input
                className="w-full h-[42px] px-3.5 border border-border rounded-xl bg-surface text-text text-sm outline-none transition-all placeholder:text-text-secondary hover:border-primary-light focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder={valuePlaceholder}
                {...register(`${name}.${index}.value`)}
              />
            </div>

            {fields.length > 1 && (
              <button
                type="button"
                className="w-7 h-7 rounded-lg border-none bg-transparent text-accent-red hover:bg-red-100 flex items-center justify-center cursor-pointer shrink-0 transition-colors"
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
        className="mt-1 inline-flex items-center gap-2 self-start max-sm:w-full max-sm:justify-center h-10 px-4 border border-dashed border-primary-light rounded-xl bg-primary-surface text-primary text-[13px] font-semibold cursor-pointer hover:bg-surface-green hover:border-primary transition-all"
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
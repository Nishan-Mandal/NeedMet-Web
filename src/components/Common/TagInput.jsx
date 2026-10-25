import { useState } from "react";

export default function TagInput({ tags = [], onChange, placeholder }) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const val = input.trim().toLowerCase();

    if (val && !tags.includes(val)) {
      onChange([...tags, val]);
    }

    setInput("");
  };

  const removeTag = (tag) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }

    if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-2 p-2.5 min-h-14 border-[1.5px] border-border rounded-xl bg-surface transition-all focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(15,92,62,0.12)]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 py-1 pr-2.5 pl-3 rounded-full bg-primary-surface text-primary text-[13px] font-medium border border-primary/20"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="border-none bg-transparent text-primary-light text-base cursor-pointer leading-none hover:text-accent-red transition-colors"
            >
              ×
            </button>
          </span>
        ))}

        <input
          className="flex-1 min-w-[140px] border-none outline-none text-sm text-text bg-transparent p-1 placeholder:text-text-secondary"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : "Add more..."}
        />
      </div>
    </div>
  );
}
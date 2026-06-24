import { useState } from "react";
import styles from "../../style/Common/TagInput.module.css";

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
    <div className={styles.wrapper}>
      <div className={styles.box}>
        {tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className={styles.remove}
            >
              ×
            </button>
          </span>
        ))}

        <input
          className={styles.input}
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
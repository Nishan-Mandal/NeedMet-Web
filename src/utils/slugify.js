/**
 * Generates an SEO-friendly slug from a string.
 * Removes special characters, converts to lowercase, and replaces spaces/multiple hyphens with a single hyphen.
 * 
 * @param {string} text The input text to convert to a slug.
 * @returns {string} The formatted slug.
 */
export function generateSlug(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove all non-alphanumeric, non-space, non-hyphen chars (like apostrophes, commas)
    .replace(/\s+/g, "-")         // Replace spaces with a single hyphen
    .replace(/-+/g, "-")          // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, "")            // Remove leading hyphens
    .replace(/-+$/, "");           // Remove trailing hyphens
}

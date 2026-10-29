import { generateSlug } from "../../utils/slugify.js";

/**
 * Extracts clean starting text after headings from markdown or text content.
 * Strips leading frontmatter, headings (# ...), images (![...]...), and HTML tags,
 * returning the first meaningful prose paragraph.
 */
export function extractContentSnippet(content = "", maxLength = 180) {
  if (!content || typeof content !== "string") return "";
  let clean = content.trim();

  // Strip any sequence of leading frontmatter, headings, or images in any order
  let prev;
  do {
    prev = clean;
    clean = clean
      .replace(/^---[\s\S]*?---/m, "")
      .replace(/^#+\s+[^\n]*\n*/m, "")
      .replace(/^!\[[^\]]*\]\([^)]*\)\s*/g, "")
      .replace(/^<img\b[^>]*\/?>\s*/gi, "")
      .trim();
  } while (clean !== prev);

  const paragraphs = clean.split(/\n\s*\n/);
  let firstParagraph = "";
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (
      !trimmed ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("|") ||
      trimmed.startsWith("!") ||
      trimmed.startsWith("<img") ||
      trimmed.startsWith("---") ||
      trimmed.startsWith("***")
    ) {
      continue;
    }
    firstParagraph = trimmed;
    break;
  }
  if (!firstParagraph) firstParagraph = clean;

  let plainText = firstParagraph
    .replace(/^#+\s+/gm, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^>\s+/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length > maxLength) {
    return plainText.slice(0, maxLength).trim() + "...";
  }
  return plainText;
}

export class Article {
  constructor({
    id = "",
    title = "",
    slug = "",
    description = "",
    contentMarkdown = "",
    coverImage = "",
    createdAt = null,
    readingTime = 4,
    likesCount = 0,
  } = {}) {
    this.id = id;
    this.title = title;
    this.slug = slug || generateSlug(title);
    this.description = description;
    // Keep summary as alias to description so existing UI references work
    this.summary = description;
    this.contentMarkdown = contentMarkdown;
    this.coverImage = coverImage;
    this.createdAt = createdAt;
    // Keep publishedAt as alias to createdAt
    this.publishedAt = createdAt;
    this.readingTime = readingTime;
    this.likesCount = likesCount;
  }

  static fromJson(json = {}) {
    const rawTitle = json.title || json.heading || "Untitled Article";
    const rawContent = json.content_markdown || json.content || json.markdown || "";

    // Extract starting content after heading as description, with fallbacks
    const extractedSnippet = extractContentSnippet(rawContent, 180);
    const rawDescription = extractedSnippet || json.description || json.summary || json.excerpt || "";

    // Normalize date from Firestore timestamp, ISO string, or number
    let parsedDate = new Date();
    const dateSource =
      json.created_at ||
      json.createdAt ||
      json.published_at ||
      json.publishedAt ||
      json.timestamp;

    if (dateSource?.toDate) {
      parsedDate = dateSource.toDate();
    } else if (dateSource) {
      parsedDate = new Date(dateSource);
    }

    const coverImage =
      json.hero_image_url ||
      json.cover_image ||
      json.coverImage ||
      json.imageUrl ||
      json.image_url ||
      "";

    const readingTime =
      json.reading_time_minutes ||
      json.readingTime ||
      4;

    return new Article({
      id: json.id || json.article_id || json.articleId || "",
      title: rawTitle,
      slug: json.slug || generateSlug(rawTitle),
      description: rawDescription,
      contentMarkdown: rawContent,
      coverImage,
      createdAt: parsedDate,
      readingTime: Number(readingTime) || 4,
      likesCount: Number(json.likes_count || json.likesCount || json.likes || 0),
    });
  }

  toJson() {
    return {
      article_id: this.id,
      title: this.title,
      slug: this.slug,
      description: this.description,
      content_markdown: this.contentMarkdown,
      hero_image_url: this.coverImage,
      created_at: this.createdAt,
      reading_time_minutes: this.readingTime,
      likes_count: this.likesCount,
    };
  }
}

import { generateSlug } from "../../utils/slugify.js";

/**
 * Automatically infers a user-friendly category if none is explicitly provided.
 */
function inferCategory(title = "", keywords = []) {
  const text = (title + " " + keywords.join(" ")).toLowerCase();
  if (text.includes("fitness") || text.includes("gym") || text.includes("workout")) return "Fitness & Gyms";
  if (text.includes("laundry") || text.includes("dry clean") || text.includes("cleaning")) return "Cleaning & Laundry";
  if (text.includes("plumb") || text.includes("electric") || text.includes("repair")) return "Home Repairs";
  if (text.includes("food") || text.includes("cafe") || text.includes("restaurant") || text.includes("dining")) return "Food & Dining";
  if (text.includes("salon") || text.includes("spa") || text.includes("beauty") || text.includes("makeup")) return "Salons & Beauty";
  if (text.includes("doctor") || text.includes("clinic") || text.includes("health") || text.includes("hospital")) return "Health & Medical";
  return "Local Guides";
}

/**
 * Calculates estimated reading time in minutes based on content word count.
 * Average reading speed: 200 words per minute.
 */
function estimateReadingTime(content = "") {
  if (!content) return 4;
  const cleanText = content.replace(/<[^>]*>/g, " ");
  const wordCount = cleanText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / 200);
  return Math.max(1, minutes);
}

export class Article {
  constructor({
    id = "",
    title = "",
    slug = "",
    summary = "",
    content = "",
    contentHtml = "",
    contentMarkdown = "",
    coverImage = "",
    category = "Local Guides",
    tags = [],
    author = { name: "NeedMet Editorial", avatar: "", role: "Local Guide Specialist" },
    publishedAt = null,
    readingTime = 4,
    viewsCount = 0,
    likesCount = 0,
    featured = false,
    citations = [],
    articleImages = [],
    seo = {},
    businessId = "",
  } = {}) {
    this.id = id;
    this.title = title;
    this.slug = slug || generateSlug(title);
    this.summary = summary;
    this.content = content;
    this.contentHtml = contentHtml;
    this.contentMarkdown = contentMarkdown;
    this.coverImage = coverImage;
    this.category = category;
    this.tags = tags;
    this.author = author;
    this.publishedAt = publishedAt;
    this.readingTime = readingTime;
    this.viewsCount = viewsCount;
    this.likesCount = likesCount;
    this.featured = featured;
    this.citations = citations;
    this.articleImages = articleImages;
    this.seo = seo;
    this.businessId = businessId;
  }

  static fromJson(json = {}) {
    const rawTitle = json.title || json.heading || "Untitled Article";

    // Extract cleanest content (prefer HTML then Markdown)
    const rawContent =
      json.content_html ||
      json.content ||
      json.html_content ||
      json.article_html ||
      json.content_markdown ||
      json.body ||
      json.description ||
      "";

    // Extract best summary (prefer meta_description from SEO object)
    let rawSummary =
      json.seo?.meta_description ||
      json.meta_description ||
      json.summary ||
      "";

    // If excerpt was provided and is not raw markdown header, use it as fallback
    if (!rawSummary && json.excerpt && !json.excerpt.startsWith("#")) {
      rawSummary = json.excerpt;
    }

    // Otherwise, generate from clean text
    if (!rawSummary && rawContent) {
      rawSummary = rawContent.replace(/<[^>]*>/g, "").replace(/^#+\s.*$/gm, "").trim().slice(0, 160) + "...";
    }

    // Cover image: check hero_image_url first (from auto blog generator), then fallbacks
    let coverImage =
      json.hero_image_url ||
      json.cover_image ||
      json.coverImage ||
      json.image_url ||
      json.imageUrl ||
      json.image ||
      json.banner ||
      "";

    // If not found, check article_images array for hero
    if (!coverImage && Array.isArray(json.article_images) && json.article_images.length > 0) {
      const heroImg = json.article_images.find((img) => img.type === "hero");
      coverImage = heroImg?.url || json.article_images[0]?.url || "";
    }

    // Tags & Keywords
    const tags =
      (Array.isArray(json.seo?.focus_keywords) && json.seo.focus_keywords) ||
      (Array.isArray(json.tags) && json.tags) ||
      (Array.isArray(json.keywords) && json.keywords) ||
      [];

    // Inferred or explicit category
    const category = json.category || inferCategory(rawTitle, tags);

    // Normalize date from Firestore timestamp, ISO string, or number
    let parsedDate = new Date();
    const dateSource =
      json.created_at ||
      json.createdAt ||
      json.published_at ||
      json.publishedAt ||
      json.updated_at ||
      json.timestamp;

    if (dateSource?.toDate) {
      parsedDate = dateSource.toDate();
    } else if (dateSource) {
      parsedDate = new Date(dateSource);
    }

    // Author info
    let authorObj = {
      name: "NeedMet Editorial",
      avatar: "",
      role: "Local Discovery Specialist",
    };
    const rawAuthor = json.author || json.author_name;
    if (typeof rawAuthor === "string" && rawAuthor.trim()) {
      authorObj.name = rawAuthor;
    } else if (rawAuthor && typeof rawAuthor === "object") {
      authorObj = {
        name: rawAuthor.name || "NeedMet Editorial",
        avatar: rawAuthor.avatar || rawAuthor.image || "",
        role: rawAuthor.role || "Local Discovery Specialist",
      };
    }

    // Reading time
    const readingTime =
      json.reading_time_minutes ||
      json.readingTime ||
      estimateReadingTime(rawContent);

    return new Article({
      id: json.id || json.article_id || json.articleId || "",
      title: rawTitle,
      slug: json.slug || generateSlug(rawTitle),
      summary: rawSummary,
      content: rawContent,
      contentHtml: json.content_html || json.html_content || json.article_html || "",
      contentMarkdown: json.content_markdown || json.markdown || "",
      coverImage,
      category,
      tags,
      author: authorObj,
      publishedAt: parsedDate,
      readingTime: Number(readingTime) || 5,
      viewsCount: Number(json.viewsCount || json.views || 0),
      likesCount: Number(json.likes_count || json.likesCount || json.likes || 0),
      featured: Boolean(json.featured || json.is_featured || json.isFeatured),
      citations: Array.isArray(json.citations) ? json.citations : [],
      articleImages: Array.isArray(json.article_images) ? json.article_images : [],
      seo: json.seo || {},
      businessId: json.business_id || "",
    });
  }

  toJson() {
    return {
      title: this.title,
      slug: this.slug,
      summary: this.summary,
      content: this.content,
      coverImage: this.coverImage,
      category: this.category,
      tags: this.tags,
      author: this.author,
      publishedAt: this.publishedAt,
      readingTime: this.readingTime,
      viewsCount: this.viewsCount,
      likes_count: this.likesCount,
      featured: this.featured,
      citations: this.citations,
      articleImages: this.articleImages,
      seo: this.seo,
      businessId: this.businessId,
    };
  }
}

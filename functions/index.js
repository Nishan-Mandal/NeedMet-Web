const { onRequest } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { initializeApp, getApps } = require("firebase-admin/app");
const { getFirestore, FieldValue, Timestamp } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const fs = require("fs");
const path = require("path");

if (!getApps().length) {
  initializeApp();
}
const db = getFirestore();

// Comprehensive list of social crawler and search bot user-agent identifiers
const SOCIAL_BOT_USER_AGENTS = [
  "whatsapp",
  "facebookexternalhit",
  "facebot",
  "meta-externalagent",
  "twitterbot",
  "linkedinbot",
  "telegrambot",
  "slackbot",
  "discordbot",
  "pinterest",
  "skypeuripreview",
  "applebot",
  "googlebot",
  "bingbot",
  "duckduckbot",
  "baiduspider",
  "yandexbot",
  "vkshare",
  "w3c_validator",
  "instagram",
  "threads",
];

// Helper to sanitize HTML strings against XSS injection
function escapeHtml(text = "") {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Generate URL slug matching frontend logic
function generateSlug(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// Extract the first few lines of text after the title from markdown
function extractFirstLinesAfterTitle(content = "", maxLength = 180) {
  if (!content) return "";
  let text = String(content).trim();

  // Strip leading headings (# Title, ## Title, etc.) and images
  text = text
    .replace(/^#+\s+[^\n]*\n*/g, "")
    .replace(/^!\[[^\]]*\]\([^)]*\)\s*/g, "")
    .trim();

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && !l.startsWith("!"));

  const snippet = lines
    .slice(0, 3)
    .join(" ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (snippet.length > maxLength) {
    return snippet.slice(0, maxLength).trim() + "...";
  }
  return snippet;
}

// Convert markdown headings, lists, and paragraphs to semantic HTML for search crawlers
function simpleMarkdownToHtml(md = "") {
  if (!md) return "";
  const lines = String(md).split(/\r?\n/);
  const htmlParts = [];
  let inList = false;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      continue;
    }

    if (trimmed.startsWith("### ")) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      htmlParts.push(`<h3>${escapeHtml(trimmed.slice(4))}</h3>`);
    } else if (trimmed.startsWith("## ")) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      htmlParts.push(`<h2>${escapeHtml(trimmed.slice(3))}</h2>`);
    } else if (trimmed.startsWith("# ")) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      htmlParts.push(`<h2>${escapeHtml(trimmed.slice(2))}</h2>`);
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) { htmlParts.push("<ul>"); inList = true; }
      htmlParts.push(`<li>${escapeHtml(trimmed.slice(2))}</li>`);
    } else {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      htmlParts.push(`<p>${escapeHtml(trimmed)}</p>`);
    }
  }
  if (inList) {
    htmlParts.push("</ul>");
  }
  return htmlParts.join("\n");
}

// Helper to log bot sharing events to "sharestatus" Firestore collection.
async function logShareStatus(data) {
  try {
    await db.collection("sharestatus").add({
      ...data,
      timestamp: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("Failed to write to sharestatus collection:", err);
  }
}

// In-Memory cache of the production index.html
let cachedIndexHtml = null;
let cachedIndexHtmlTime = 0;
const INDEX_HTML_TTL_MS = 15 * 60 * 1000; // 15 minutes

async function getIndexHtml() {
  if (cachedIndexHtml && Date.now() - cachedIndexHtmlTime < INDEX_HTML_TTL_MS) {
    return cachedIndexHtml;
  }

  // 1. Try reading from local filesystem
  try {
    const localDistPath = path.join(__dirname, "../dist/index.html");
    if (fs.existsSync(localDistPath)) {
      cachedIndexHtml = fs.readFileSync(localDistPath, "utf8");
      cachedIndexHtmlTime = Date.now();
      return cachedIndexHtml;
    }
  } catch (_) {}

  // 2. In Cloud Functions production, fetch live production index.html from Hosting CDN
  try {
    const res = await fetch("https://needmet.in/index.html");
    if (res.ok) {
      cachedIndexHtml = await res.text();
      cachedIndexHtmlTime = Date.now();
      return cachedIndexHtml;
    }
  } catch (err) {
    console.error("Error fetching live index.html from hosting:", err);
  }

  return (
    cachedIndexHtml ||
    "<!doctype html><html><head><title>NeedMet</title></head><body><div id='root'></div></body></html>"
  );
}

// Helper to extract listingId from any URL format or query param
function extractListingId(req) {
  if (req.query && req.query.id) {
    return req.query.id;
  }

  const candidates = [req.path, req.url, req.originalUrl].filter(Boolean);
  for (const candidate of candidates) {
    const match = candidate.match(/\/listing\/([^\/\?#]+)/i);
    if (match && match[1]) {
      return match[1];
    }
  }

  for (const candidate of candidates) {
    const parts = candidate.split("?")[0].split("/").filter(Boolean);
    const idx = parts.findIndex((p) => p.toLowerCase() === "listing");
    if (idx !== -1 && parts[idx + 1]) {
      return parts[idx + 1];
    }
  }

  return null;
}

/**
 * Cloud Function to serve rich pre-rendered SEO content to search crawlers (Googlebot, Bingbot)
 * and OpenGraph meta tags to social media preview bots (WhatsApp, Facebook, Twitter, Telegram).
 * Normal visitors always receive the full React Single Page Application.
 */
exports.shareListing = onRequest(
  {
    cors: true,
    region: "us-central1",
    maxInstances: 10,
  },
  async (req, res) => {
    const userAgent = (req.headers["user-agent"] || "").toLowerCase();
    const matchedBot = SOCIAL_BOT_USER_AGENTS.find((bot) => userAgent.includes(bot));
    const isBot = Boolean(matchedBot);
    const clientIp = req.headers["x-forwarded-for"] || req.ip || "";

    const listingId = extractListingId(req);

    // 1. If human visitor or missing ID, serve standard React SPA HTML
    if (!isBot || !listingId) {
      const fullHtml = await getIndexHtml();
      res.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
      return res.status(200).send(fullHtml);
    }

    // 2. Crawler bot: fetch listing data from Firestore
    try {
      const docSnap = await db.collection("listings").doc(listingId).get();

      if (!docSnap.exists) {
        logShareStatus({
          listingId,
          isBot: true,
          botType: matchedBot,
          userAgent: req.headers["user-agent"] || "",
          ip: clientIp,
          status: "listing_not_found",
          path: req.path || req.originalUrl || "",
        });

        const fullHtml = await getIndexHtml();
        res.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
        return res.status(200).send(fullHtml);
      }

      const listing = docSnap.data();

      const name = listing.name || "Business";
      const category = listing.category || "Local Business";
      const categorySlug = generateSlug(category);
      const address = listing.address || "";

      // Title for preview: Name and location
      const title = address ? `${name} - ${address}` : name;

      // About / Description: If preview is already provided in listing, show it directly with NO extra text.
      // If preview is not generated / missing, only then show extra fallback text.
      const hasAbout = Boolean(listing.description && listing.description.trim());
      const description = hasAbout
        ? String(listing.description)
            .replace(/<[^>]*>/g, "")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 180)
        : `Find ${name} (${category}) in ${address}. Get contact details, directions, opening hours and reviews on NeedMet.`.slice(0, 180);

      let imageUrl = "https://needmet.in/og-default.png";
      let imageType = "image/png";

      if (Array.isArray(listing.images) && listing.images.length > 0) {
        const firstImg = listing.images[0];
        const rawUrl = typeof firstImg === "string" ? firstImg : (firstImg?.fullUrl || firstImg?.thumbUrl);
        if (rawUrl) {
          imageUrl = rawUrl;
          if (imageUrl.includes(".webp")) {
            imageType = "image/webp";
          } else if (imageUrl.includes(".png")) {
            imageType = "image/png";
          } else {
            imageType = "image/jpeg";
          }
        }
      }

      const slug = listing.name ? generateSlug(listing.name) : "";
      const canonicalUrl = slug
        ? `https://needmet.in/listing/${listingId}/${slug}`
        : `https://needmet.in/listing/${listingId}`;

      logShareStatus({
        listingId,
        listingName: name,
        category,
        isBot: true,
        botType: matchedBot,
        userAgent: req.headers["user-agent"] || "",
        ip: clientIp,
        status: "preview_generated",
        path: req.path || req.originalUrl || "",
      });

      // Prepare rich Schema.org structured data
      const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": name,
        "description": description,
        "image": imageUrl,
        "url": canonicalUrl,
        "telephone": listing.phone || listing.alternatePhone || undefined,
        "address": address ? {
          "@type": "PostalAddress",
          "streetAddress": address,
          "addressCountry": "IN"
        } : undefined,
        "geo": listing.geo ? {
          "@type": "GeoCoordinates",
          "latitude": listing.geo.lat,
          "longitude": listing.geo.lng
        } : undefined,
        "aggregateRating": (listing.ratingCount && listing.ratingCount > 0) ? {
          "@type": "AggregateRating",
          "ratingValue": listing.rating || 0,
          "reviewCount": listing.ratingCount
        } : undefined
      };

      const breadcrumbsSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://needmet.in/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": category,
            "item": `https://needmet.in/listings/category/${categorySlug}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": name,
            "item": canonicalUrl
          }
        ]
      };

      // Construct clean, crawlable HTML: showing image, name, about, and address
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${canonicalUrl}" />

  <!-- Open Graph / WhatsApp / Facebook / LinkedIn -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="NeedMet" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:secure_url" content="${imageUrl}" />
  <meta property="og:image:type" content="${imageType}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${escapeHtml(name)}" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${canonicalUrl}" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${imageUrl}" />
  <meta name="twitter:image:alt" content="${escapeHtml(name)}" />

  <!-- Schema.org Structured Data -->
  <script type="application/ld+json">
${JSON.stringify(localBusinessSchema)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(breadcrumbsSchema)}
  </script>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #1f2937; max-width: 800px; margin: 0 auto; padding: 20px;">
  <article>
    <header>
      <h1 style="font-size: 28px; margin-bottom: 8px;">${escapeHtml(name)}</h1>
      ${address ? `<p style="color: #4b5563; font-size: 15px; margin-bottom: 16px;"><strong>Address:</strong> ${escapeHtml(address)}</p>` : ""}
    </header>

    ${imageUrl ? `
    <div style="margin: 20px 0;">
      <img src="${imageUrl}" alt="${escapeHtml(name)}" width="1200" height="630" style="max-width: 100%; height: auto; border-radius: 8px;" />
    </div>` : ""}

    ${hasAbout ? `
    <section style="margin: 24px 0;">
      <h2 style="font-size: 20px; margin-bottom: 8px;">About</h2>
      <p style="white-space: pre-line;">${escapeHtml(listing.description)}</p>
    </section>` : `
    <section style="margin: 24px 0;">
      <p>${escapeHtml(description)}</p>
    </section>`}
  </article>
</body>
</html>`;

      res.set("Cache-Control", "private, max-age=300");
      return res.status(200).send(html);
    } catch (error) {
      console.error(`Error generating preview for listing ${listingId}:`, error);

      logShareStatus({
        listingId,
        isBot: true,
        botType: matchedBot,
        userAgent: req.headers["user-agent"] || "",
        ip: clientIp,
        status: "error",
        error: error.message || String(error),
        path: req.path || req.originalUrl || "",
      });

      const fullHtml = await getIndexHtml();
      res.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
      return res.status(200).send(fullHtml);
    }
  }
);

// Helper to extract articleId from /blog/:id or query params
function extractArticleId(req) {
  if (req.query && (req.query.id || req.query.articleId)) {
    return req.query.id || req.query.articleId;
  }

  const candidates = [req.path, req.url, req.originalUrl].filter(Boolean);
  for (const candidate of candidates) {
    const match = candidate.match(/\/blog\/([^\/\?#]+)/i);
    if (match && match[1]) {
      return match[1];
    }
  }

  for (const candidate of candidates) {
    const parts = candidate.split("?")[0].split("/").filter(Boolean);
    const idx = parts.findIndex((p) => p.toLowerCase() === "blog");
    if (idx !== -1 && parts[idx + 1]) {
      return parts[idx + 1];
    }
  }

  return null;
}

/**
 * Cloud Function to serve rich pre-rendered SEO content for blog guides
 */
exports.shareArticle = onRequest(
  {
    cors: true,
    region: "us-central1",
    maxInstances: 10,
  },
  async (req, res) => {
    const userAgent = (req.headers["user-agent"] || "").toLowerCase();
    const matchedBot = SOCIAL_BOT_USER_AGENTS.find((bot) => userAgent.includes(bot));
    const isBot = Boolean(matchedBot);
    const clientIp = req.headers["x-forwarded-for"] || req.ip || "";

    const articleId = extractArticleId(req);

    // 1. If human visitor or missing ID, serve standard SPA HTML
    if (!isBot || !articleId) {
      const fullHtml = await getIndexHtml();
      res.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
      return res.status(200).send(fullHtml);
    }

    // 2. Crawler bot: fetch article from Firestore "gen_articles"
    try {
      let docSnap = await db.collection("gen_articles").doc(articleId).get();

      if (!docSnap.exists) {
        const slugQuery = await db
          .collection("gen_articles")
          .where("slug", "==", articleId)
          .limit(1)
          .get();
        if (!slugQuery.empty) {
          docSnap = slugQuery.docs[0];
        }
      }

      if (!docSnap.exists) {
        logShareStatus({
          articleId,
          isBot: true,
          botType: matchedBot,
          userAgent: req.headers["user-agent"] || "",
          ip: clientIp,
          status: "article_not_found",
          path: req.path || req.originalUrl || "",
        });

        const fullHtml = await getIndexHtml();
        res.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
        return res.status(200).send(fullHtml);
      }

      const article = docSnap.data();
      const realId = docSnap.id;

      const title = article.title || "NeedMet Article";
      const slug = article.slug || generateSlug(title);
      const canonicalUrl = slug
        ? `https://needmet.in/blog/${realId}/${slug}`
        : `https://needmet.in/blog/${realId}`;

      // Extract first some lines after the title from markdown
      const contentSnippet = extractFirstLinesAfterTitle(article.content_markdown || article.description || "");

      // If snippet is generated, show it directly with NO extra text.
      // If not generated, only then show extra fallback text.
      const description = contentSnippet || `Read "${title}" on NeedMet.`;

      const imageUrl = article.hero_image_url || "https://needmet.in/og-default.png";
      let imageType = "image/png";
      if (imageUrl.includes(".webp")) {
        imageType = "image/webp";
      } else if (imageUrl.includes(".jpg") || imageUrl.includes(".jpeg")) {
        imageType = "image/jpeg";
      }

      const authorName = "NeedMet Editorial";
      const category = "Local Guides";

      logShareStatus({
        articleId: realId,
        articleTitle: title,
        category,
        isBot: true,
        botType: matchedBot,
        userAgent: req.headers["user-agent"] || "",
        ip: clientIp,
        status: "article_preview_generated",
        path: req.path || req.originalUrl || "",
      });

      const blogPostingSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": description,
        "image": imageUrl,
        "datePublished": article.created_at || undefined,
        "author": {
          "@type": "Organization",
          "name": authorName
        },
        "publisher": {
          "@type": "Organization",
          "name": "NeedMet",
          "url": "https://needmet.in",
          "logo": {
            "@type": "ImageObject",
            "url": "https://needmet.in/og-default.png"
          }
        },
        "mainEntityOfPage": canonicalUrl
      };

      const breadcrumbsSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://needmet.in/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "NeedMet Guides",
            "item": "https://needmet.in/blogs"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": title,
            "item": canonicalUrl
          }
        ]
      };

      const articleBodyHtml = simpleMarkdownToHtml(article.content_markdown || description);

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${canonicalUrl}" />

  <!-- Open Graph / WhatsApp / Facebook / LinkedIn -->
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="NeedMet" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:secure_url" content="${imageUrl}" />
  <meta property="og:image:type" content="${imageType}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${escapeHtml(title)}" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${canonicalUrl}" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${imageUrl}" />
  <meta name="twitter:image:alt" content="${escapeHtml(title)}" />

  <!-- Schema.org Structured Data -->
  <script type="application/ld+json">
${JSON.stringify(blogPostingSchema)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(breadcrumbsSchema)}
  </script>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #1f2937; max-width: 800px; margin: 0 auto; padding: 20px;">
  <article>
    <header>
      <h1 style="font-size: 28px; margin-bottom: 16px;">${escapeHtml(title)}</h1>
    </header>

    ${imageUrl ? `
    <div style="margin: 20px 0;">
      <img src="${imageUrl}" alt="${escapeHtml(title)}" width="1200" height="630" style="max-width: 100%; height: auto; border-radius: 8px;" />
    </div>` : ""}

    <div class="article-content" style="font-size: 16px; margin: 24px 0;">
      ${articleBodyHtml}
    </div>
  </article>
</body>
</html>`;

      res.set("Cache-Control", "private, max-age=300");
      return res.status(200).send(html);
    } catch (error) {
      console.error(`Error generating preview for article ${articleId}:`, error);

      logShareStatus({
        articleId,
        isBot: true,
        botType: matchedBot,
        userAgent: req.headers["user-agent"] || "",
        ip: clientIp,
        status: "error",
        error: error.message || String(error),
        path: req.path || req.originalUrl || "",
      });

      const fullHtml = await getIndexHtml();
      res.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
      return res.status(200).send(fullHtml);
    }
  }
);

/* =========================================================================
   DYNAMIC & INCREMENTAL SITEMAP ENGINE
   - Runs twice a week (Every Monday and Thursday at 03:00 AM IST)
   - Incremental logic: fetches only listings and blogs created since lastRunAt
     (e.g., ran on Jan 2 -> next run on Jan 5 fetches only Jan 2–5 additions)
   - Merges new URLs into existing sitemap XML without duplicates
   - Persists state in Firestore "sitemaps" collection and Cloud Storage bucket
   - Fast onRequest function serves pre-compiled sitemaps with CDN caching (0 collection scans)
   ========================================================================= */

// In-Memory cache for lightning-fast sub-millisecond responses
const sitemapMemoryCache = new Map();
const SITEMAP_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function getCachedSitemap(key) {
  const cached = sitemapMemoryCache.get(key);
  if (cached && Date.now() - cached.timestamp < SITEMAP_CACHE_TTL_MS) {
    return cached.xml;
  }
  return null;
}

function setCachedSitemap(key, xml) {
  sitemapMemoryCache.set(key, { xml, timestamp: Date.now() });
}

function clearSitemapCache() {
  sitemapMemoryCache.clear();
}

// Helper: Extract existing <loc> URLs from XML to prevent duplicates
function extractExistingUrls(xml = "") {
  const urls = new Set();
  if (!xml) return urls;
  const matches = xml.matchAll(/<loc>(.*?)<\/loc>/gi);
  for (const match of matches) {
    if (match[1]) urls.add(match[1].trim());
  }
  return urls;
}

// Helper: Merge new <url> items into an existing sitemap XML
function mergeUrlsIntoSitemap(existingXml = "", newItems = []) {
  if (!existingXml || !existingXml.includes("</urlset>")) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${newItems
  .map(
    (item) => `  <url>
    <loc>${item.loc}</loc>${item.lastmod ? `\n    <lastmod>${item.lastmod}</lastmod>` : ""}
    <changefreq>${item.changefreq || "weekly"}</changefreq>
    <priority>${item.priority || "0.7"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;
  }

  if (newItems.length === 0) {
    return existingXml;
  }

  const newXmlBlocks = newItems
    .map(
      (item) => `  <url>
    <loc>${item.loc}</loc>${item.lastmod ? `\n    <lastmod>${item.lastmod}</lastmod>` : ""}
    <changefreq>${item.changefreq || "weekly"}</changefreq>
    <priority>${item.priority || "0.7"}</priority>
  </url>`
    )
    .join("\n");

  const insertIndex = existingXml.lastIndexOf("</urlset>");
  return existingXml.slice(0, insertIndex) + newXmlBlocks + "\n</urlset>";
}

/* =========================================================================
   CLOUD STORAGE & PERSISTENCE ENGINE FOR SITEMAPS
   - Cloud Storage Bucket: Primary storage for the full XML files.
     Why? Google Sitemaps can hold up to 50,000 URLs / 50MB. Firestore documents
     have a strict 1MB size limit (~6,000 listings), so Cloud Storage is the
     only location capable of storing large listing sitemaps safely without crashing.
   - Firestore: Stores lightweight metadata only (lastRunAt, totalUrls, timestamps).
     Document size is tiny (~200 bytes), ensuring zero risk of exceeding 1MB.
   ========================================================================= */

const SITEMAP_BUCKET_NAME =
  process.env.STORAGE_BUCKET ||
  process.env.VITE_STORAGE_BUCKET;

function getSitemapBucket() {
  return SITEMAP_BUCKET_NAME
    ? getStorage().bucket(SITEMAP_BUCKET_NAME)
    : getStorage().bucket();
}

// Save complete XML file directly to Cloud Storage (no file size limit)
async function saveSitemapFile(filename, xml) {
  try {
    const bucket = getSitemapBucket();
    const file = bucket.file(`sitemaps/${filename}`);
    await file.save(xml, {
      contentType: "application/xml; charset=utf-8",
      resumable: false,
      metadata: {
        cacheControl: "public, max-age=14400, s-maxage=86400",
      },
    });
    console.log(`Saved ${filename} to Cloud Storage (${Buffer.byteLength(xml, "utf8")} bytes)`);
  } catch (err) {
    console.error(`Error saving ${filename} to Cloud Storage bucket (${SITEMAP_BUCKET_NAME || "default"}):`, err);
    throw err;
  }
}

// Read complete XML file from Cloud Storage
async function readSitemapFile(filename) {
  try {
    const bucket = getSitemapBucket();
    const file = bucket.file(`sitemaps/${filename}`);
    const [exists] = await file.exists();
    if (!exists) return null;
    const [contents] = await file.download();
    return contents.toString("utf8");
  } catch (err) {
    console.warn(`Could not read ${filename} from Cloud Storage:`, err.message);
    return null;
  }
}

/**
 * Incrementally updates the listings sitemap.
 * - Primary storage: Cloud Storage (sitemaps/sitemap-listings.xml) - holds full XML with no size limits.
 * - Single metadata doc: Firestore (sitemaps/listings) - tracks lastRunAt and stats.
 */
async function updateListingSitemapIncremental(forceFull = false) {
  const sitemapRef = db.collection("sitemaps").doc("listings");

  const [sitemapSnap, storageXml] = await Promise.all([
    sitemapRef.get(),
    readSitemapFile("sitemap-listings.xml"),
  ]);

  const metaData = sitemapSnap.exists ? sitemapSnap.data() : {};
  let lastRunAt = !forceFull && metaData.lastRunAt ? metaData.lastRunAt : null;
  let existingXml = storageXml || (sitemapSnap.exists ? sitemapSnap.data()?.xml || "" : "");

  // If existing sitemap XML does not exist or is invalid, perform full initial build
  if (!existingXml || !existingXml.includes("</urlset>")) {
    lastRunAt = null;
  }

  let snap;
  if (lastRunAt) {
    // Incremental: query only listings created since last scheduled run
    snap = await db
      .collection("listings")
      .where("createdAt", ">=", lastRunAt)
      .get();
  } else {
    // Baseline full build (runs once on day 0 to capture all existing listings)
    try {
      snap = await db.collection("listings").get();
    } catch (err) {
      console.error("Error fetching baseline listings for sitemap:", err);
      snap = { docs: [], forEach: () => {} };
    }
  }

  const existingUrls = extractExistingUrls(existingXml);
  const newItems = [];

  snap.forEach((doc) => {
    const data = doc.data();
    const name = data.name || "business";
    const slug = generateSlug(name);
    let lastmod = "";
    const ts = data.updatedAt || data.createdAt;
    if (ts) {
      try {
        const d = ts.toDate ? ts.toDate() : new Date(ts);
        lastmod = d.toISOString().split("T")[0];
      } catch (_) {}
    }
    const loc = `https://needmet.in/listing/${doc.id}/${slug}`;
    if (!existingUrls.has(loc)) {
      newItems.push({
        loc,
        lastmod,
        changefreq: "weekly",
        priority: "0.7",
      });
      existingUrls.add(loc);
    }
  });

  const updatedXml = mergeUrlsIntoSitemap(existingXml, newItems);
  const now = Timestamp.now();
  const xmlSizeBytes = Buffer.byteLength(updatedXml, "utf8");

  // 1. PRIMARY: Save full XML file directly to Cloud Storage (no size limit)
  await saveSitemapFile("sitemap-listings.xml", updatedXml);

  // 2. METADATA: Save run stats in the single Firestore doc sitemaps/listings
  await sitemapRef.set({
    lastRunAt: now,
    updatedAt: now,
    totalUrls: existingUrls.size,
    lastNewAddedCount: newItems.length,
    fileSizeBytes: xmlSizeBytes,
    storagePath: "sitemaps/sitemap-listings.xml",
    mode: lastRunAt ? "incremental" : "full_initial",
  });

  setCachedSitemap("listings", updatedXml);
  return { newAdded: newItems.length, total: existingUrls.size, bytes: xmlSizeBytes };
}

/**
 * Incrementally updates the blog articles sitemap.
 * - Primary storage: Cloud Storage (sitemaps/sitemap-blogs.xml).
 * - Single metadata doc: Firestore (sitemaps/blogs).
 */
async function updateBlogSitemapIncremental(forceFull = false) {
  const sitemapRef = db.collection("sitemaps").doc("blogs");

  const [sitemapSnap, storageXml] = await Promise.all([
    sitemapRef.get(),
    readSitemapFile("sitemap-blogs.xml"),
  ]);

  const metaData = sitemapSnap.exists ? sitemapSnap.data() : {};
  let lastRunAt = !forceFull && metaData.lastRunAt ? metaData.lastRunAt : null;
  let existingXml = storageXml || (sitemapSnap.exists ? sitemapSnap.data()?.xml || "" : "");

  if (!existingXml || !existingXml.includes("</urlset>")) {
    lastRunAt = null;
  }

  let snap;
  if (lastRunAt) {
    // In DB, created_at is stored as an ISO string, so match string type
    const lastRunIso = lastRunAt.toDate ? lastRunAt.toDate().toISOString() : new Date(lastRunAt).toISOString();
    snap = await db
      .collection("gen_articles")
      .where("created_at", ">=", lastRunIso)
      .get();
  } else {
    // Baseline full build (runs once on day 0 to capture all existing articles)
    try {
      snap = await db.collection("gen_articles").get();
    } catch (err) {
      console.error("Error fetching articles for sitemap:", err);
      snap = { docs: [], forEach: () => {} };
    }
  }

  const existingUrls = extractExistingUrls(existingXml);
  const newItems = [];

  snap.forEach((doc) => {
    const data = doc.data();
    const title = data.title || "";
    const slug = data.slug || generateSlug(title);
    const lastmod = data.created_at ? String(data.created_at).split("T")[0] : "";
    const loc = `https://needmet.in/blog/${doc.id}/${slug}`;
    if (!existingUrls.has(loc)) {
      newItems.push({
        loc,
        lastmod,
        changefreq: "weekly",
        priority: "0.7",
      });
      existingUrls.add(loc);
    }
  });

  const updatedXml = mergeUrlsIntoSitemap(existingXml, newItems);
  const now = Timestamp.now();
  const xmlSizeBytes = Buffer.byteLength(updatedXml, "utf8");

  await saveSitemapFile("sitemap-blogs.xml", updatedXml);

  await sitemapRef.set({
    lastRunAt: now,
    updatedAt: now,
    totalUrls: existingUrls.size,
    lastNewAddedCount: newItems.length,
    fileSizeBytes: xmlSizeBytes,
    storagePath: "sitemaps/sitemap-blogs.xml",
    mode: lastRunAt ? "incremental" : "full_initial",
  });

  setCachedSitemap("blogs", updatedXml);
  return { newAdded: newItems.length, total: existingUrls.size, bytes: xmlSizeBytes };
}

/**
 * Updates categories sitemap from categories collection.
 * - Primary storage: Cloud Storage (sitemaps/sitemap-categories.xml).
 * - Single metadata doc: Firestore (sitemaps/categories).
 */
async function updateCategoriesSitemap() {
  const sitemapRef = db.collection("sitemaps").doc("categories");
  try {
    const snap = await db.collection("categories").get();
    const urls = [];

    snap.forEach((doc) => {
      const data = doc.data();
      const name = data.name || data.category || "";
      if (name) {
        const slug = generateSlug(name);
        urls.push(`https://needmet.in/listings/category/${slug}`);
      }
    });

    const uniqueUrls = [...new Set(urls)];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls
  .map(
    (loc) => `  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    const now = Timestamp.now();
    const xmlSizeBytes = Buffer.byteLength(xml, "utf8");

    await saveSitemapFile("sitemap-categories.xml", xml);

    await sitemapRef.set({
      updatedAt: now,
      totalUrls: uniqueUrls.length,
      fileSizeBytes: xmlSizeBytes,
      storagePath: "sitemaps/sitemap-categories.xml",
    });

    setCachedSitemap("categories", xml);
    return { total: uniqueUrls.length };
  } catch (err) {
    console.error("Error generating categories sitemap:", err);
    throw err;
  }
}

/**
 * Scheduled Cloud Function: Runs every day at 03:00 AM IST
 * Dynamically fetches only listings and blogs newly added since the last run
 * and incrementally merges them into the persistent sitemaps in Cloud Storage.
 */
exports.scheduledSitemapUpdate = onSchedule(
  {
    schedule: "0 3 * * *", // Runs every day at 03:00 AM IST
    timeZone: "Asia/Kolkata",
    memory: "512MiB",
    timeoutSeconds: 300,
  },
  async (event) => {
    console.log("Starting scheduled incremental sitemap update...");
    try {
      const [listingRes, blogRes, catRes] = await Promise.all([
        updateListingSitemapIncremental(false),
        updateBlogSitemapIncremental(false),
        updateCategoriesSitemap(),
      ]);
      clearSitemapCache();
      console.log("Scheduled sitemap update completed successfully:", {
        listings: listingRes,
        blogs: blogRes,
        categories: catRes,
      });
    } catch (err) {
      console.error("Error during scheduled sitemap update:", err);
    }
  }
);

/**
 * Cloud Function to serve pre-compiled XML Sitemaps.
 * Instantly serves sub-sitemaps and sitemap index from memory / Cloud Storage with CDN caching headers.
 * Allows on-demand manual refresh via ?refresh=true for testing.
 */
exports.sitemap = onRequest(
  {
    cors: true,
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 120,
    maxInstances: 5,
  },
  async (req, res) => {
    const rawPath = (req.path || req.url || "").toLowerCase();
    const isForceRefresh = req.query.refresh === "true" || req.query.force === "true";

    // 0. Manual on-demand refresh endpoint for instant testing
    if (isForceRefresh) {
      try {
        const [listings, blogs, categories] = await Promise.all([
          updateListingSitemapIncremental(false),
          updateBlogSitemapIncremental(false),
          updateCategoriesSitemap(),
        ]);
        clearSitemapCache();
        return res.status(200).json({
          success: true,
          message: "Incremental sitemap update executed successfully",
          stats: { listings, blogs, categories },
        });
      } catch (refreshErr) {
        return res.status(500).json({ success: false, error: refreshErr.message });
      }
    }

    // 1. Core static pages sitemap
    if (rawPath.includes("sitemap-static")) {
      const staticPages = [
        { loc: "https://needmet.in/", priority: "1.0", changefreq: "daily" },
        { loc: "https://needmet.in/all_categories", priority: "0.9", changefreq: "weekly" },
        { loc: "https://needmet.in/blogs", priority: "0.8", changefreq: "daily" },
        { loc: "https://needmet.in/search", priority: "0.5", changefreq: "monthly" },
        { loc: "https://needmet.in/listings/recommended", priority: "0.7", changefreq: "daily" },
        { loc: "https://needmet.in/listings/newly_added", priority: "0.7", changefreq: "daily" },
        { loc: "https://needmet.in/docs/about_us", priority: "0.5", changefreq: "monthly" },
        { loc: "https://needmet.in/docs/contact_us", priority: "0.5", changefreq: "monthly" },
        { loc: "https://needmet.in/docs/privacy_policy", priority: "0.4", changefreq: "monthly" },
        { loc: "https://needmet.in/docs/safety", priority: "0.4", changefreq: "monthly" },
        { loc: "https://needmet.in/docs/terms_service", priority: "0.4", changefreq: "monthly" },
        { loc: "https://needmet.in/docs/listing_policy", priority: "0.4", changefreq: "monthly" },
        { loc: "https://needmet.in/docs/community_guidelines", priority: "0.4", changefreq: "monthly" },
      ];

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (p) => `  <url>
    <loc>${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

      res.set("Content-Type", "application/xml; charset=utf-8");
      res.set("Cache-Control", "public, max-age=14400, s-maxage=86400");
      return res.status(200).send(xml);
    }

    // 2. Categories sitemap
    if (rawPath.includes("sitemap-categories")) {
      try {
        let xml = getCachedSitemap("categories");
        if (!xml) {
          xml = await readSitemapFile("sitemap-categories.xml");
          if (!xml) {
            await updateCategoriesSitemap();
            xml = getCachedSitemap("categories") || (await readSitemapFile("sitemap-categories.xml"));
          }
          if (xml) setCachedSitemap("categories", xml);
        }

        res.set("Content-Type", "application/xml; charset=utf-8");
        res.set("Cache-Control", "public, max-age=14400, s-maxage=86400");
        return res.status(200).send(xml);
      } catch (err) {
        console.error("Error serving categories sitemap:", err);
        return res.status(500).send("Error serving categories sitemap");
      }
    }

    // 3. Blog articles sitemap
    if (rawPath.includes("sitemap-blogs")) {
      try {
        let xml = getCachedSitemap("blogs");
        if (!xml) {
          xml = await readSitemapFile("sitemap-blogs.xml");
          if (!xml) {
            await updateBlogSitemapIncremental(false);
            xml = getCachedSitemap("blogs") || (await readSitemapFile("sitemap-blogs.xml"));
          }
          if (xml) setCachedSitemap("blogs", xml);
        }

        res.set("Content-Type", "application/xml; charset=utf-8");
        res.set("Cache-Control", "public, max-age=14400, s-maxage=86400");
        return res.status(200).send(xml);
      } catch (err) {
        console.error("Error serving blogs sitemap:", err);
        return res.status(500).send("Error serving blogs sitemap");
      }
    }

    // 4. Listings sitemap
    if (rawPath.includes("sitemap-listings")) {
      try {
        let xml = getCachedSitemap("listings");
        if (!xml) {
          xml = await readSitemapFile("sitemap-listings.xml");
          if (!xml) {
            await updateListingSitemapIncremental(false);
            xml = getCachedSitemap("listings") || (await readSitemapFile("sitemap-listings.xml"));
          }
          if (xml) setCachedSitemap("listings", xml);
        }

        res.set("Content-Type", "application/xml; charset=utf-8");
        res.set("Cache-Control", "public, max-age=14400, s-maxage=86400");
        return res.status(200).send(xml);
      } catch (err) {
        console.error("Error serving listings sitemap:", err);
        return res.status(500).send("Error serving listings sitemap");
      }
    }

    // Default: Root Sitemap Index
    const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://needmet.in/sitemap-static.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://needmet.in/sitemap-categories.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://needmet.in/sitemap-blogs.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://needmet.in/sitemap-listings.xml</loc>
  </sitemap>
</sitemapindex>`;

    res.set("Content-Type", "application/xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=14400, s-maxage=86400");
    return res.status(200).send(indexXml);
  }
);

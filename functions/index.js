const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp, getApps } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
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

// Helper to log bot sharing events to "sharestatus" Firestore collection.
// NOTE: Only bot crawls and errors are logged here to avoid exploding the database with every human page view.
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
async function getIndexHtml() {
  if (cachedIndexHtml) {
    return cachedIndexHtml;
  }

  // 1. Try reading from local filesystem (works during local tests if dist exists)
  try {
    const localDistPath = path.join(__dirname, "../dist/index.html");
    if (fs.existsSync(localDistPath)) {
      cachedIndexHtml = fs.readFileSync(localDistPath, "utf8");
      return cachedIndexHtml;
    }
  } catch (_) {}

  // 2. In Cloud Functions production, fetch the live production index.html from Hosting CDN
  try {
    const res = await fetch("https://needmet.in/index.html");
    if (res.ok) {
      cachedIndexHtml = await res.text();
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

    // 1. If it's a real human visitor (or no listing ID found), serve the full React SPA
    // IMPORTANT:
    // (a) Do NOT log human visits to Firestore: listing URLs get thousands of human pageviews,
    //     which would blow up the database quota and collection size.
    // (b) Use "private, no-cache, no-store, must-revalidate" so Google CDN does NOT cache
    //     the human SPA shell at the edge. If the human response were cached on CDN,
    //     subsequent bot requests from WhatsApp/Facebook would receive the cached SPA shell
    //     instead of hitting this function to get Open Graph tags.
    if (!isBot || !listingId) {
      const fullHtml = await getIndexHtml();
      res.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
      return res.status(200).send(fullHtml);
    }

    // 2. If it's a social crawler bot (WhatsApp, Facebook, Twitter, Telegram, etc.), fetch data from Firestore
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
      const address = listing.address || "";

      const title = `${name} in ${address} - ${category} | NeedMet`;
      const description = listing.description
        ? listing.description.slice(0, 160)
        : `Find ${name} (${category}) in ${address}. Get contact details, directions, opening hours and reviews on NeedMet.`.slice(0, 160);

      let imageUrl = "https://needmet.in/og-default.png";
      let imageType = "image/png";

      if (Array.isArray(listing.images) && listing.images.length > 0) {
        const firstImg = listing.images[0];
        // Use fullUrl if available, otherwise thumbUrl or string
        const rawUrl = typeof firstImg === "string" ? firstImg : (firstImg?.fullUrl || firstImg?.thumbUrl || imageUrl);
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

      // Log successful bot preview generation asynchronously
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

      // Construct clean, lightweight Open Graph HTML for bots.
      // Avoid large inline SVGs or body bloat so crawlers can easily parse the head tags and image.
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
</head>
<body>
  <h1>${escapeHtml(name)}</h1>
  <p>${escapeHtml(description)}</p>
  <img src="${imageUrl}" alt="${escapeHtml(name)}" />
</body>
</html>`;

      // Set private caching for the bot response so CDN never caches it to serve to human visitors
      res.set("Cache-Control", "private, max-age=300");
      return res.status(200).send(html);
    } catch (error) {
      console.error(`Error generating OG preview for listing ${listingId}:`, error);

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

    // 1. If human visitor or missing ID, serve standard SPA HTML without CDN caching
    if (!isBot || !articleId) {
      const fullHtml = await getIndexHtml();
      res.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
      return res.status(200).send(fullHtml);
    }

    // 2. Bot crawler: fetch article from Firestore "gen_articles"
    try {
      let docSnap = await db.collection("gen_articles").doc(articleId).get();

      // If not found by direct ID, attempt lookup by slug field
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

      const title = article.title || article.heading || "NeedMet Article";

      let description =
        article.seo?.meta_description ||
        article.meta_description ||
        article.summary ||
        article.excerpt ||
        "";

      if (!description && article.content) {
        description = String(article.content)
          .replace(/<[^>]*>/g, "")
          .replace(/^#+\s.*$/gm, "")
          .trim();
      }
      description = (description || `Read "${title}" on NeedMet. Helpful tips, guides, and insights.`).slice(0, 160);

      // Cover image resolution matching Article model
      let imageUrl =
        article.hero_image_url ||
        article.cover_image ||
        article.coverImage ||
        article.image_url ||
        article.imageUrl ||
        article.image ||
        article.banner ||
        "https://needmet.in/og-default.png";

      if ((!imageUrl || imageUrl === "https://needmet.in/og-default.png") && Array.isArray(article.article_images) && article.article_images.length > 0) {
        const heroImg = article.article_images.find((img) => img.type === "hero");
        imageUrl = heroImg?.url || article.article_images[0]?.url || "https://needmet.in/og-default.png";
      }

      let imageType = "image/png";
      if (imageUrl.includes(".webp")) {
        imageType = "image/webp";
      } else if (imageUrl.includes(".jpg") || imageUrl.includes(".jpeg")) {
        imageType = "image/jpeg";
      }

      const slug = article.slug || generateSlug(title);
      const canonicalUrl = slug
        ? `https://needmet.in/blog/${realId}/${slug}`
        : `https://needmet.in/blog/${realId}`;

      const authorName = article.author?.name || (typeof article.author === "string" ? article.author : "NeedMet Editorial");
      const category = article.category || "Local Guides";

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

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} | NeedMet</title>
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
  <meta property="article:section" content="${escapeHtml(category)}" />
  <meta property="article:author" content="${escapeHtml(authorName)}" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${canonicalUrl}" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${imageUrl}" />
  <meta name="twitter:image:alt" content="${escapeHtml(title)}" />
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(description)}</p>
  <img src="${imageUrl}" alt="${escapeHtml(title)}" />
</body>
</html>`;

      res.set("Cache-Control", "private, max-age=300");
      return res.status(200).send(html);
    } catch (error) {
      console.error(`Error generating OG preview for article ${articleId}:`, error);

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

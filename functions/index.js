const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp, getApps } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const fs = require("fs");
const path = require("path");

if (!getApps().length) {
  initializeApp();
}
const db = getFirestore();

// Social crawler user-agent identifiers
const SOCIAL_BOT_USER_AGENTS = [
  "whatsapp",
  "facebookexternalhit",
  "facebot",
  "twitterbot",
  "linkedinbot",
  "telegrambot",
  "slackbot",
  "pinterest",
  "discordbot",
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

// Helper to log every function call to "sharestatus" Firestore collection
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

// In-Memory cache of index.html (read once when server boots)
let cachedIndexHtml = null;
function getIndexHtml() {
  if (!cachedIndexHtml) {
    try {
      const indexPath = path.join(__dirname, "../dist/index.html");
      if (fs.existsSync(indexPath)) {
        cachedIndexHtml = fs.readFileSync(indexPath, "utf8");
      }
    } catch (err) {
      console.error("Error reading index.html from dist:", err);
    }
  }
  return (
    cachedIndexHtml ||
    "<!doctype html><html><head><title>NeedMet</title></head><body><div id='root'></div></body></html>"
  );
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

    // Extract listingId from /listing/:listingId or query param ?id=...
    const pathParts = req.path.split("/").filter(Boolean);
    const listingId = (pathParts[0] === "listing" ? pathParts[1] : null) || req.query.id;

    // 1. If it's a real human visitor (or no listing ID found), serve the standard React SPA
    if (!isBot || !listingId) {
      logShareStatus({
        listingId: listingId || null,
        isBot: false,
        botType: null,
        userAgent: req.headers["user-agent"] || "",
        ip: clientIp,
        status: "human_served",
        path: req.path || "",
      });

      res.set("Cache-Control", "public, max-age=300, s-maxage=600");
      return res.status(200).send(getIndexHtml());
    }

    // 2. If it's a social crawler bot, fetch data from Firestore
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
          path: req.path || "",
        });

        res.set("Cache-Control", "public, max-age=300, s-maxage=600");
        return res.status(200).send(getIndexHtml());
      }

      const listing = docSnap.data();

      const name = listing.name || "Business";
      const category = listing.category || "Local Business";
      const address = listing.address || "";

      const title = `${name} in ${address} - ${category} | NeedMet`;
      const description = `Find ${name} (${category}) in ${address}. Get contact details, directions, opening hours, and more on NeedMet.`.slice(0, 160);

      let imageUrl = "https://needmet.in/og-default.png";
      if (Array.isArray(listing.images) && listing.images.length > 0) {
        const firstImg = listing.images[0];
        imageUrl = typeof firstImg === "string" ? firstImg : firstImg?.fullUrl || imageUrl;
      }

      const canonicalUrl = `https://needmet.in/listing/${listingId}`;

      // Log successful bot share preview generation asynchronously
      logShareStatus({
        listingId,
        listingName: name,
        category,
        isBot: true,
        botType: matchedBot,
        userAgent: req.headers["user-agent"] || "",
        ip: clientIp,
        status: "preview_generated",
        path: req.path || "",
      });

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  
  <!-- Open Graph / WhatsApp / Facebook -->
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="NeedMet" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:secure_url" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${imageUrl}" />
</head>
<body>
  <h1>${escapeHtml(name)}</h1>
  <p>${escapeHtml(description)}</p>
  <img src="${imageUrl}" alt="${escapeHtml(name)}" />
  <script>
    window.location.replace("${canonicalUrl}");
  </script>
</body>
</html>`;

      res.set("Cache-Control", "public, max-age=600, s-maxage=3600");
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
        path: req.path || "",
      });

      res.set("Cache-Control", "public, max-age=60, s-maxage=120");
      return res.status(200).send(getIndexHtml());
    }
  }
);

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
  "meta-externalagent",
  "applebot",
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

// Helper to extract listingId from any URL format
function extractListingId(req) {
  if (req.query && req.query.id) {
    return req.query.id;
  }

  const reqPath = req.path || req.url || "";
  const match = reqPath.match(/\/listing\/([^\/\?#]+)/i);
  if (match && match[1]) {
    return match[1];
  }

  const parts = reqPath.split("/").filter(Boolean);
  const idx = parts.findIndex((p) => p.toLowerCase() === "listing");
  if (idx !== -1 && parts[idx + 1]) {
    return parts[idx + 1];
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

      const fullHtml = await getIndexHtml();
      res.set("Cache-Control", "public, max-age=300, s-maxage=600");
      return res.status(200).send(fullHtml);
    }

    // 2. If it's a social crawler bot (WhatsApp, Facebook, etc.), fetch data from Firestore
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

        const fullHtml = await getIndexHtml();
        res.set("Cache-Control", "public, max-age=300, s-maxage=600");
        return res.status(200).send(fullHtml);
      }

      const listing = docSnap.data();

      const name = listing.name || "Business";
      const category = listing.category || "Local Business";
      const address = listing.address || "";

      const title = `${name} in ${address} - ${category} | NeedMet`;
      const description = `Find ${name} (${category}) in ${address}. Get contact details, directions, opening hours on NeedMet. ★★★★★`.slice(0, 190);

      let imageUrl = "https://needmet.in/og-default.png";
      if (Array.isArray(listing.images) && listing.images.length > 0) {
        const firstImg = listing.images[0];
        imageUrl = typeof firstImg === "string" ? firstImg : firstImg?.fullUrl || imageUrl;
      }

      const canonicalUrl = `https://needmet.in/listing/${listingId}`;

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
        path: req.path || "",
      });

      const starSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#f59e0b" xmlns="http://www.w3.org/2000/svg"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
      
      const whatsappSvg = `<svg width="24" height="24" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><defs><path id="wa_bg" d="M1023.941 765.153c0 5.606-.171 17.766-.508 27.159-.824 22.982-2.646 52.639-5.401 66.151-4.141 20.306-10.392 39.472-18.542 55.425-9.643 18.871-21.943 35.775-36.559 50.364-14.584 14.56-31.472 26.812-50.315 36.416-16.036 8.172-35.322 14.426-55.744 18.549-13.378 2.701-42.812 4.488-65.648 5.3-9.402.336-21.564.505-27.15.505l-504.226-.081c-5.607 0-17.765-.172-27.158-.509-22.983-.824-52.639-2.646-66.152-5.4-20.306-4.142-39.473-10.392-55.425-18.542-18.872-9.644-35.775-21.944-50.364-36.56-14.56-14.584-26.812-31.471-36.415-50.314-8.174-16.037-14.428-35.323-18.551-55.744-2.7-13.378-4.487-42.812-5.3-65.649-.334-9.401-.503-21.563-.503-27.148l.08-504.228c0-5.607.171-17.766.508-27.159.825-22.983 2.646-52.639 5.401-66.151 4.141-20.306 10.391-39.473 18.542-55.426C34.154 93.24 46.455 76.336 61.07 61.747c14.584-14.559 31.472-26.812 50.315-36.416 16.037-8.172 35.324-14.426 55.745-18.549 13.377-2.701 42.812-4.488 65.648-5.3 9.402-.335 21.565-.504 27.149-.504l504.227.081c5.608 0 17.766.171 27.159.508 22.983.825 52.638 2.646 66.152 5.401 20.305 4.141 39.472 10.391 55.425 18.542 18.871 9.643 35.774 21.944 50.363 36.559 14.559 14.584 26.812 31.471 36.415 50.315 8.174 16.037 14.428 35.323 18.551 55.744 2.7 13.378 4.486 42.812 5.3 65.649.335 9.402.504 21.564.504 27.15l-.082 504.226z"/><linearGradient id="wa_grad" x1="512" x2="512" y1="0" y2="1024" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#61fd7d"/><stop offset="1" stop-color="#2bb826"/></linearGradient></defs><use href="#wa_bg" fill="url(#wa_grad)"/><path fill="#FFF" d="M783.302 243.246c-69.329-69.387-161.529-107.619-259.763-107.658-202.402 0-367.133 164.668-367.214 367.072-.026 64.699 16.883 127.854 49.017 183.522l-52.096 190.229 194.665-51.047c53.636 29.244 114.022 44.656 175.482 44.682h.151c202.382 0 367.128-164.688 367.21-367.094.039-98.087-38.121-190.319-107.452-259.706zM523.544 808.047h-.125c-54.767-.021-108.483-14.729-155.344-42.529l-11.146-6.612-115.517 30.293 30.834-112.592-7.259-11.544c-30.552-48.579-46.688-104.729-46.664-162.379.066-168.229 136.985-305.096 305.339-305.096 81.521.031 158.154 31.811 215.779 89.482s89.342 134.332 89.312 215.859c-.066 168.243-136.984 305.118-305.209 305.118zm167.415-228.515c-9.177-4.591-54.286-26.782-62.697-29.843-8.41-3.062-14.526-4.592-20.645 4.592-6.115 9.182-23.699 29.843-29.053 35.964-5.352 6.122-10.704 6.888-19.879 2.296-9.176-4.591-38.74-14.277-73.786-45.526-27.275-24.319-45.691-54.359-51.043-63.543-5.352-9.183-.569-14.146 4.024-18.72 4.127-4.109 9.175-10.713 13.763-16.069 4.587-5.355 6.117-9.183 9.175-15.304 3.059-6.122 1.529-11.479-.765-16.07-2.293-4.591-20.644-49.739-28.29-68.104-7.447-17.886-15.013-15.466-20.645-15.747-5.346-.266-11.469-.322-17.585-.322s-16.057 2.295-24.467 11.478-32.113 31.374-32.113 76.521c0 45.147 32.877 88.764 37.465 94.885 4.588 6.122 64.699 98.771 156.741 138.502 21.892 9.45 38.982 15.094 52.308 19.322 21.98 6.979 41.982 5.995 57.793 3.634 17.628-2.633 54.284-22.189 61.932-43.615 7.646-21.427 7.646-39.791 5.352-43.617-2.294-3.826-8.41-6.122-17.585-10.714z"/></svg>`;

      const facebookSvg = `<svg width="24" height="24" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#1877f2" d="M1024,512C1024,229.2,794.8,0,512,0S0,229.2,0,512c0,255.6,187.2,467.4,432,505.8V660H302V512H432V399.2C432,270.9,508.4,200,625.4,200c56,0,114.6,10,114.6,10V336H675.4C611.8,336,592,375.5,592,416v96h142l-22.7,148H592v357.8C836.8,979.4,1024,767.6,1024,512z"/></svg>`;

      const instagramSvg = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#E1306C" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`;

      const linkedinSvg = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#0A66C2" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`;

      const websiteSvg = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#3b82f6" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`;

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
  <div style="display:flex;gap:4px;align-items:center;">
    ${starSvg}${starSvg}${starSvg}${starSvg}${starSvg}
  </div>
  <p>${escapeHtml(description)}</p>
  <div style="display:flex;gap:8px;align-items:center;">
    ${whatsappSvg}
    ${instagramSvg}
    ${facebookSvg}
    ${linkedinSvg}
    ${websiteSvg}
  </div>
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

      const fullHtml = await getIndexHtml();
      res.set("Cache-Control", "public, max-age=60, s-maxage=120");
      return res.status(200).send(fullHtml);
    }
  }
);

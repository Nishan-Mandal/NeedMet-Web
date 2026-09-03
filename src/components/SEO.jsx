import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DEFAULT_OG_IMAGE = "https://needmet.in/og-default.png";
const SITE_NAME = "NeedMet";

/**
 * SEO Component to dynamically update document head elements.
 *
 * @param {Object} props
 * @param {string} props.title              The page title.
 * @param {string} props.description        The meta description.
 * @param {string} [props.canonicalUrl]     Optional canonical URL override.
 * @param {Object} [props.schema]           Optional JSON-LD structured data object.
 * @param {string} [props.image]            Optional OG/Twitter image URL. Falls back to default.
 * @param {string} [props.ogType]           OG type — "website" (default) or "article".
 */
export default function SEO({ title, description, canonicalUrl, schema, image, ogType = "website" }) {
  const location = useLocation();

  useEffect(() => {
    // --- 1. Title ---
    if (title) {
      document.title = title;
    }

    // --- 2. Meta Description ---
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    if (description) {
      metaDescription.setAttribute("content", description);
    }

    // --- 3. Canonical URL ---
    let cleanPathname = location.pathname;
    if (cleanPathname.length > 1 && cleanPathname.endsWith("/")) {
      cleanPathname = cleanPathname.slice(0, -1);
    }
    const finalCanonicalUrl = canonicalUrl || `https://needmet.in${cleanPathname}`;

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute("href", finalCanonicalUrl);

    // --- 4. OG + Twitter Tags ---
    const ogImage = image || DEFAULT_OG_IMAGE;

    const metaTags = [
      { property: "og:title",       content: title },
      { property: "og:description", content: description },
      { property: "og:url",         content: finalCanonicalUrl },
      { property: "og:type",        content: ogType },
      { property: "og:image",       content: ogImage },
      { property: "og:site_name",   content: SITE_NAME },
      { name: "twitter:card",        content: "summary_large_image" },
      { name: "twitter:title",       content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image",       content: ogImage },
    ];

    metaTags.forEach(({ property, name, content }) => {
      if (!content) return;
      const attr  = property ? "property" : "name";
      const value = property || name;
      let el = document.querySelector(`meta[${attr}="${value}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, value);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    });

    // --- 5. JSON-LD Schema ---
    let scriptSchema = document.querySelector('script[id="seo-schema-jsonld"]');
    if (schema) {
      if (!scriptSchema) {
        scriptSchema = document.createElement("script");
        scriptSchema.setAttribute("type", "application/ld+json");
        scriptSchema.setAttribute("id", "seo-schema-jsonld");
        document.head.appendChild(scriptSchema);
      }
      scriptSchema.textContent = JSON.stringify(schema);
    } else {
      if (scriptSchema) {
        scriptSchema.remove();
      }
    }
  }, [title, description, canonicalUrl, schema, image, ogType, location.pathname]);

  // Clean up JSON-LD on unmount to prevent schema leaking into other pages
  useEffect(() => {
    return () => {
      const scriptSchema = document.querySelector('script[id="seo-schema-jsonld"]');
      if (scriptSchema) {
        scriptSchema.remove();
      }
    };
  }, []);

  return null;
}

# NeedMet SEO Strategy & Implementation Checklist (https://needmet.in)

This document serves as the official SEO (Search Engine Optimization) guide and checklist for the NeedMet web application. It outlines the technical, on-page, and off-page SEO requirements necessary to ensure that local businesses listed on NeedMet rank high on Google and other search engines.

---

## 1. Crawling & Indexing (Search Engine Interaction)

Crawling is the discovery process where search engine bots scan your website's content. Indexing is the storage and organization of that content in search databases. Because NeedMet is built as a React Single Page Application (SPA), we must handle crawling with care.

### The Rendering Gap
* **Traditional Websites**: Return pre-built HTML pages. Search engines can instantly read and index the content.
* **React SPA (Client-Side Rendered)**: Returns an empty HTML skeleton. The browser (or crawler) must execute Javascript to fetch data from Firestore and render the page.
* **Googlebot**: Runs a two-stage index process. It indexes the basic HTML first, then puts the page in a queue to run Javascript and index the final content later (which can delay ranking by days or weeks).
* **Social Media Bots (Facebook, WhatsApp, Twitter, LinkedIn)**: Do not run Javascript. They will only see the basic index shell, meaning shares of individual business listings won't display correct names, photos, or descriptions.

### Core Strategy for Crawlers
1. **JavaScript Indexing Optimization**: Ensure search engines can access and render all listing elements without blocking scripts.
2. **Bot-Targeted Pre-rendering**: Intercept social media crawler bots on the server (Firebase Hosting) and serve them static, pre-rendered versions of listing pages with complete metadata, while serving normal visitors the standard interactive React SPA.
3. **Internal Linking**: Ensure every page, listing, and category page can be reached by clicking standard HTML text links. Search crawlers navigate websites by following links; if a page is only reachable through dynamic searches or button clicks without URL changes, bots cannot find it.

---

## 2. Robots.txt Configuration

The `robots.txt` file is the first file search engines read when visiting your site. It defines which areas of the site bots are allowed to crawl and which they must ignore. This preserves "crawl budget" (the limit on how many pages a bot will crawl on your site in a given time).

### Key Rules
* **Exclusions**: Block search engines from crawling admin dashboards, user accounts, drafts, and multi-step contribution forms. This keeps search engines focused only on high-value public pages.
* **Inclusions**: Explicitly allow categories, lists, and individual listing pages.
* **Sitemap Pointer**: Always place the absolute link to the sitemap at the bottom of the `robots.txt` file.

### Ideal File Layout (to be placed in the public directory)
* User-agents set to all (`*`).
* Allow the home page (`/`), category listings (`/listings/`), search results index, and individual pages (`/listing/`).
* Disallow private or administrative paths (e.g., `/admin/`, `/auth/`, `/contribute/`).

---

## 3. Dynamic XML Sitemaps

A sitemap is an XML file that lists all critical URLs of your website, helping search engines discover new and updated pages faster.

### Structure
For a directory website like NeedMet, a single sitemap can quickly exceed size limits (50,000 URLs or 50MB). Therefore, use a **Sitemap Index** file that points to sub-sitemaps:
1. **Core Sitemap**: Contains static pages (Home, About, Legal Documents, Categories index).
2. **Category Sitemaps**: Lists all categories (e.g., `/listings/category/salons`, `/listings/category/electricians`).
3. **Listings Sitemaps**: Lists individual active, verified business profiles.

### Technical Checklist
* **Dynamic Generation**: The sitemaps must update automatically. When a new listing is published or updated, the sitemap must instantly reflect the new URL and the modification date (`<lastmod>`).
* **Clean URLs Only**: Never include pages that return a 404 error, redirecting URLs, or non-canonical pages in the sitemap.
* **Frequency and Priority**: Assign higher priority (`1.0` or `0.8`) to the homepage and category indices, and medium priority (`0.7` or `0.6`) to individual businesses. Set change frequency to `daily` for active categories and `weekly` for individual listings.

---

## 4. URL Architecture & Slug Optimization

Clean, descriptive, and keyword-rich URLs are critical. They help users understand where they are and provide search engine crawlers with direct context about the page's subject.

### Bad vs. Good URL Structures
* **Bad**: `https://needmet.in/listing/XyZ8713b4`
  * *Reason*: The listing ID is meaningless to both human searchers and search engines.
* **Good**: `https://needmet.in/listing/XyZ8713b4/johns-barber-shop-delhi`
  * *Reason*: It contains the unique ID (needed for the database query) followed by an SEO-friendly "slug" that contains the business name, category, and location.

### Implementation Checklist
* **Lower Case**: Ensure all URLs are strictly lowercase. Search engines treat uppercase and lowercase URLs as separate pages (e.g., `/salons` vs `/Salons`), which can cause duplicate content issues.
* **Hyphen Separation**: Use hyphens (`-`) to separate words in slugs. Do not use spaces, underscores, or special characters.
* **Trailing Slash Consistency**: Decide on a single format (either always having a trailing slash or never having one) and enforce it globally.

---

## 5. Canonical URLs (Canonicalization)

Duplicate content occurs when identical or highly similar content is accessible on multiple URLs. Search engines penalize duplicate pages because they do not know which version to index and rank.

### The Solution: Canonical Tags
A canonical tag is an HTML header element that tells search engines: *"Although this page is accessible on multiple URLs, this specific URL is the master version that you should index."*

### Scenarios to Address
* **Search Filters & Sorting**: On listing pages, sorting by rating or filtering by distance generates dynamic URLs (e.g., `/listings/salons?sort=rating` or `/listings/salons?near=mumbai`). These pages must point their canonical tag back to the clean, root category URL: `https://needmet.in/listings/category/salons`.
* **Protocol & Subdomain Consistency**: Enforce either HTTPS over HTTP and choose between the `www` or non-`www` version of the domain. Setup global redirects on Firebase Hosting so that `http://needmet.in`, `http://www.needmet.in`, and `https://www.needmet.in` all redirect to `https://needmet.in`.
* **Self-Referential Canonicals**: Every clean page on the site must have a canonical tag that points to itself to prevent tracking parameters (like Facebook ad clicks or UTM tags) from creating duplicate versions.

---

## 6. On-Page SEO Checklist

On-page SEO refers to optimizing the parts of your website that are visible to users and search engines.

### 6.1 Meta Title Tags
The title tag appears as the clickable headline in search results.
* **Length**: Keep titles between 50 to 60 characters to prevent truncation in search listings.
* **Format for Listings**: `[Business Name] in [Address / City] - [Category] | NeedMet` (e.g., *Royal Hair Salon in South Delhi - Salons & Spas | NeedMet*).
* **Format for Categories**: `Best [Category Name] Services in [City/Area] | NeedMet`.

### 6.2 Meta Descriptions
The description snippet summary displayed beneath the title in search results.
* **Length**: Keep descriptions between 150 to 160 characters.
* **Content**: Write compelling, call-to-action content that includes key search terms. Include ratings, phone numbers, and categories to encourage users to click (e.g., *Looking for the best salon in South Delhi? Check ratings, reviews, opening hours, and contact Royal Hair Salon directly on NeedMet.*).

### 6.3 Heading Structure (H1 - H6)
Use clean semantic HTML headings so crawlers understand page hierarchies.
* **Rule of One H1**: Every page must have exactly one `<h1>` tag. For listings, the `<h1>` must contain only the Business Name.
* **H2 Subheadings**: Use `<h2>` tags for major sections like "Business Timings", "Contact Information", "Customer Reviews", and "Similar Businesses".
* **H3 Subheadings**: Use `<h3>` tags for secondary headings, such as listing card titles in recommendations.

### 6.4 Image Alt Attributes
Search engine crawlers cannot "see" images; they rely on Alternative Text (alt text) to understand what the image contains.
* **Alt text requirements**: Every image on the site (logos, listing photos, carousels) must have a descriptive, keyword-appropriate alt tag. 
* *Example*: Instead of leaving it blank or using `image_1.jpg`, use `alt="Royal Hair Salon - Reception Area"`.

### 6.5 Structured Data (Schema.org)
Structured data (JSON-LD format) provides direct, structured facts about your business database to search engines. For NeedMet listings, implement the **LocalBusiness** schema:
* Provide business name, physical street address, geographical coordinates (lat/lng), contact phone, website link, and category.
* Embed **AggregateRating** nested inside the business schema, pulling in the rating score (e.g., `4.8`) and number of reviews (e.g., `35`).
* Embed opening hours matching the business schedule. This enables Google to display "Open Now" or "Closed" directly in search results.

---

## 7. Google Search Console & Analytics

Google Search Console (GSC) is the official dashboard where you monitor how Google crawls, indexes, and ranks your website.

### Setup and Verification Steps
1. **Property Creation**: Verify ownership of the root domain `needmet.in` in Search Console using the DNS TXT verification method, or by uploading a Google site verification meta tag.
2. **Sitemap Submission**: Submit your sitemap index URL (`https://needmet.in/sitemap.xml`). Monitor the reports to ensure Google can read the sitemap files and find all URLs.
3. **Mobile Usability & Coverage Inspection**: Review GSC reports weekly to check for mobile usability errors, indexing issues, and crawl errors (such as unintended 404s).
4. **Core Web Vitals Monitoring**: Use the Core Web Vitals report to track user experience metrics:
   * **Largest Contentful Paint (LCP)**: The time it takes for the main content of a page to load.
   * **Interaction to Next Paint (INP)**: Measures page responsiveness to user actions.
   * **Cumulative Layout Shift (CLS)**: Measures visual stability (elements moving around while loading).

---

## 8. Backlink Strategy & Off-Page SEO

Backlinks (links from other websites pointing to NeedMet) act as votes of confidence. The higher the number of authoritative websites pointing to NeedMet, the higher its Domain Authority, and the easier it is for listings to rank on the first page of Google.

### Link Building Actions for NeedMet
* **"Find Us on NeedMet" Badges**: Provide verified businesses with badges, banners, or widgets that they can embed on their own websites or share on social media. These badges link directly back to their NeedMet profile.
* **Local Press & Citations**: Submit articles, business announcements, and directory listings to local news websites, business directories, and forums.
* **Shareable Review Links**: Give businesses a direct link to their review modal (e.g., `/listing/id?show=review_modal`). Encouraging businesses to share this link with their customers drives traffic, increases page views, and generates user-generated content (reviews).
* **Social Sharing**: Integrate simple, native sharing buttons on listings so users can easily share businesses to WhatsApp, Facebook, and Twitter.

---

## 9. Core Web Vitals & Performance Checklists

A fast site ranks better. Mobile performance is critical because Google crawls and indexes websites using a mobile-first crawler.

### Performance Guidelines
* **Image Compression**: listings must compress user-uploaded images down to web-friendly formats (WebP) and reasonable sizes (under 200KB) before saving them to database storage.
* **Asset Pre-fetching**: Pre-fetch or pre-connect to external servers that host assets (like Google Fonts or FontAwesome icons) to reduce connection handshake delays.
* **Lazy Loading**: Set secondary listing images (thumbnails, similar listings cards) to lazy load (`loading="lazy"`) so they do not block the initial page loading resources.
* **Predefined Dimensions**: Always give image placeholders fixed aspect ratios to prevent page elements from jumping when the images finish downloading.

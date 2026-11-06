import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { marked } from "marked";
import { SEO, SystemState, BusinessCTA } from "../../components";
import {
  ArticleCard,
  ArticleProgressBar,
  ArticleShareBar,
  ArticleDetailsSkeleton,
  FullscreenViewer,
  GuideEndSection,
} from "../../components/Articles";
import {
  useArticleDetails,
  useOtherArticles,
  useArticleLikeStatus,
  useToggleArticleLike,
} from "../../hooks/useArticles";
import { useAuth } from "../../contexts/authContext";
import { useToast } from "../../contexts/toastContext";
import { generateSlug } from "../../utils/slugify";
import NoDataImg from "../../assets/no_data.png";
import ErrorImg from "../../assets/error.png";

// Configure marked options for GitHub Flavored Markdown
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Sanitizes and formats article body from markdown and/or HTML.
 * Converts markdown syntax to clean HTML while preserving pre-existing HTML tags.
 * Normalizes any markdown structures trapped in HTML paragraphs (like tables, headings, lists).
 * Wraps tables in responsive horizontal scroll wrappers.
 * Strips script tags, unsafe style blocks, and duplicate <h1> headings.
 */
function formatArticleContent(articleSource) {
  if (!articleSource) return "";

  // 1. Resolve raw content string from article object or direct string
  let raw = "";
  if (typeof articleSource === "string") {
    raw = articleSource;
  } else if (typeof articleSource === "object") {
    raw =
      articleSource.contentMarkdown ||
      articleSource.content_markdown ||
      articleSource.contentHtml ||
      articleSource.content_html ||
      articleSource.content ||
      articleSource.body ||
      "";
  }

  if (!raw || typeof raw !== "string") return "";

  // 2. Strip scripts and styles
  let cleaned = raw
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");

  // 3. Deduplicate hero image if it was included in the body
  const coverUrl =
    (typeof articleSource === "object" && (articleSource.coverImage || articleSource.hero_image_url)) || "";
  if (coverUrl && typeof coverUrl === "string") {
    const escapedUrl = coverUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const mdHeroRegex = new RegExp(`!\\[[^\\]]*\\]\\(${escapedUrl}\\)`, "i");
    cleaned = cleaned.replace(mdHeroRegex, "");

    const htmlHeroRegex = new RegExp(`<img\\b[^>]*\\bsrc=['"]${escapedUrl}['"][^>]*\\/?>`, "i");
    cleaned = cleaned.replace(htmlHeroRegex, "");
  }

  // 4. Normalize mixed markdown trapped inside HTML elements
  cleaned = cleaned.replace(/<p>\s*(\|[\s\S]*?\|)\s*<\/p>/gi, "\n\n$1\n\n");
  cleaned = cleaned.replace(/<p>\s*(#{1,6}\s+[\s\S]*?)\s*<\/p>/gi, "\n\n$1\n\n");
  cleaned = cleaned.replace(/<p>\s*([-*]\s+[\s\S]*?)\s*<\/p>/gi, "\n$1\n");
  cleaned = cleaned.replace(
    /<blockquote>\s*<p>\s*([-*]\s+[\s\S]*?)\s*<\/p>\s*<\/blockquote>/gi,
    "> $1\n"
  );

  // 5. Parse markdown to clean HTML
  let parsedHtml = marked.parse(cleaned);

  // 6. Strip duplicate <h1> at the beginning
  parsedHtml = parsedHtml.replace(/^\s*<h1\b[^>]*>[\s\S]*?<\/h1>/i, "");

  // 7. Wrap all <table> elements in responsive scroll container
  parsedHtml = parsedHtml.replace(
    /<table\b[^>]*>[\s\S]*?<\/table>/gi,
    (tableHtml) => `<div class="article-table-wrapper">${tableHtml}</div>`
  );

  // 8. Enhance inline images with lazy loading, no-referrer, and resilient proxy fallback
  parsedHtml = parsedHtml.replace(
    /<img\b([^>]*?)(\/?>)/gi,
    (match, attrs, close) => {
      let updatedAttrs = attrs;
      if (!/referrerpolicy=/i.test(updatedAttrs)) {
        updatedAttrs += ' referrerpolicy="no-referrer"';
      }
      if (!/loading=/i.test(updatedAttrs)) {
        updatedAttrs += ' loading="lazy"';
      }
      if (!/onerror=/i.test(updatedAttrs)) {
        updatedAttrs += ` onerror="if(!this.dataset.tried){this.dataset.tried='true';this.src='https://wsrv.nl/?url='+encodeURIComponent(this.src);}"`;
      }
      return `<img ${updatedAttrs.trim()}${close}`;
    }
  );

  return parsedHtml.trim();
}



/**
 * Like / Helpful Feedback Card Component (Subcollection-backed)
 */
function FeedbackCard({
  isLiked,
  likesCount = 0,
  onToggleLike,
  userLoggedIn,
  isPending = false,
}) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-border/80 shadow-2xs space-y-3.5">
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl ${
            isLiked ? "bg-rose-50 text-rose-500" : "bg-primary-surface text-primary"
          } flex items-center justify-center text-sm shrink-0 transition-colors shadow-2xs`}
        >
          <i className={isLiked ? "fa-solid fa-heart text-rose-500" : "fa-regular fa-heart"}></i>
        </div>
        <div>
          <h3 className="font-heading font-bold text-sm sm:text-base text-text m-0">
            Enjoyed this guide?
          </h3>
          <p className="text-[11px] text-text-secondary m-0">
            {likesCount} {likesCount === 1 ? "reader" : "readers"} liked this local guide
          </p>
        </div>
      </div>

      <div className="pt-1">
        <button
          type="button"
          onClick={onToggleLike}
          disabled={isPending}
          aria-pressed={isLiked}
          title={isLiked ? "Click to unlike this guide" : userLoggedIn ? "Like this guide" : "Log in to like this guide"}
          className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold font-heading transition-all duration-200 shadow-2xs ${
            isPending ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
          } ${
            isLiked
              ? "bg-rose-500 hover:bg-rose-600 text-white shadow-xs"
              : "bg-surface-container-low hover:bg-rose-50 text-text hover:text-rose-600 border border-border/80"
          }`}
        >
          <i
            className={`${
              isLiked ? "fa-solid fa-heart scale-110" : "fa-regular fa-heart"
            } text-xs sm:text-sm transition-transform`}
          ></i>
          <span>{isLiked ? "You Liked This Guide" : "Like This Guide"}</span>
        </button>
        {!userLoggedIn && (
          <p className="text-[10px] text-text-secondary text-center mt-2 m-0">
            Log in to like and save this guide
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Other Articles with Search Option Component
 */
function OtherArticlesCard({
  articles = [],
  searchQuery,
  onSearchChange,
  onClearSearch,
  title = "Top Guides",
  subtitle = "Most loved by readers",
}) {
  const filtered = useMemo(() => {
    if (!searchQuery?.trim()) return articles;
    const q = searchQuery.toLowerCase().trim();
    return articles.filter(
      (a) =>
        a.title?.toLowerCase().includes(q) ||
        a.summary?.toLowerCase().includes(q) ||
        a.category?.toLowerCase().includes(q) ||
        (Array.isArray(a.tags) && a.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }, [articles, searchQuery]);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-border/80 shadow-2xs space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 border border-amber-200/60 flex items-center justify-center text-xs shadow-2xs">
            <i className="fa-solid fa-fire text-amber-500"></i>
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-text m-0">
              {title}
            </h3>
            <p className="text-[11px] text-text-secondary m-0">
              {subtitle}
            </p>
          </div>
        </div>
        <Link
          to="/blogs"
          className="text-xs font-bold text-primary hover:text-primary-light no-underline"
        >
          View all
        </Link>
      </div>

      {/* Live Search Input */}
      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-xs"></i>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search other guides..."
          className="w-full pl-8 pr-8 py-2 rounded-xl bg-surface-container-low border border-border text-xs text-text placeholder:text-text-secondary/70 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-2xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={onClearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text text-xs p-1 cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>

      {/* Article Cards Grid / Empty State */}
      {filtered.length === 0 ? (
        <div className="py-6 text-center text-xs text-text-secondary">
          <i className="fa-solid fa-magnifying-glass text-text-secondary/50 text-base mb-1.5 block"></i>
          {searchQuery
            ? `No other guides matched "${searchQuery}".`
            : "No other guides published yet."}
          {searchQuery && (
            <button
              type="button"
              onClick={onClearSearch}
              className="mt-2 text-primary font-bold hover:underline block mx-auto cursor-pointer"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((otherArt) => (
            <ArticleCard key={otherArt.id} article={otherArt} />
          ))}
        </div>
      )}

      {/* Footer Explore Link */}
      <div className="pt-2 border-t border-border/80 text-center">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-light no-underline transition-colors"
        >
          <span>Explore all {articles.length} guides</span>
          <i className="fa-solid fa-arrow-right text-[10px]"></i>
        </Link>
      </div>
    </div>
  );
}

export default function ArticleDetails() {
  const { articleId } = useParams();
  const { showToast } = useToast();
  const { userLoggedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFloatingShare, setShowFloatingShare] = useState(false);
  const [fullscreenViewer, setFullscreenViewer] = useState({
    isOpen: false,
    images: [],
    index: 0,
    title: "",
  });

  const handleOpenFullscreen = (selectedSrc, imageTitle = "") => {
    if (!selectedSrc) return;
    const list = [];
    if (article?.coverImage) list.push(article.coverImage);
    if (Array.isArray(article?.articleImages)) {
      article.articleImages.forEach((img) => {
        const url = typeof img === "string" ? img : img?.url;
        if (url && !list.includes(url)) list.push(url);
      });
    }
    if (!list.includes(selectedSrc)) {
      list.push(selectedSrc);
    }
    const idx = Math.max(0, list.indexOf(selectedSrc));
    setFullscreenViewer({
      isOpen: true,
      images: list.length ? list : [selectedSrc],
      index: idx,
      title: imageTitle || article?.title || "",
    });
  };

  const guideEndRef = useRef(null);

  // Show floating share bar on all devices while reading, but hide it once the guide has ended
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const endEl = guideEndRef.current || document.getElementById("guide-end-section");

      let isPastEnd = false;
      if (endEl) {
        const rect = endEl.getBoundingClientRect();
        // When guide end section enters the viewport, hide the floating bar
        if (rect.top <= window.innerHeight - 60) {
          isPastEnd = true;
        }
      }

      if (scrollY > 260 && !isPastEnd) {
        setShowFloatingShare(true);
      } else {
        setShowFloatingShare(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch current article
  const {
    data: article,
    isLoading,
    isError,
    error,
    refetch,
  } = useArticleDetails(articleId);

  // Check like status for authenticated user
  const { data: isLiked = false } = useArticleLikeStatus(article?.id);
  const toggleLikeMutation = useToggleArticleLike();

  // Fetch other articles from gen_articles for sidebar & recommendations
  const { data: otherArticles = [] } = useOtherArticles({
    currentId: article?.id,
    quantity: 20,
  });

  // Sort top guides by like count (descending) for sidebar explorer
  const topGuides = useMemo(() => {
    return [...otherArticles].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
  }, [otherArticles]);

  const handleToggleLike = () => {
    if (!userLoggedIn) {
      showToast("Please log in to like this guide", "info");
      return;
    }
    if (!article?.id || toggleLikeMutation.isPending) return;
    toggleLikeMutation.mutate(
      { articleId: article.id },
      {
        onError: (err) => {
          showToast(err.message || "Failed to update like status", "error");
        },
      }
    );
  };

  // Loading state
  if (isLoading) {
    return <ArticleDetailsSkeleton />;
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <SystemState
          imageSrc={ErrorImg}
          title="Failed to Load"
          highlight="Article"
          message={
            error?.message ||
            "Unable to load this article. Please verify your internet connection and try again."
          }
          actionType="custom"
          actionLabel="Retry"
          onActionClick={() => refetch()}
        />
      </div>
    );
  }

  // Not found state
  if (!article) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <SystemState
          imageSrc={NoDataImg}
          title="Article Not"
          highlight="Found"
          message="The guide or article you're looking for doesn't exist or may have been removed."
          actionType="navigate"
          actionLabel="Browse All Guides"
          actionTo="/blogs"
        />
      </div>
    );
  }

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently published";

  const canonicalUrl = `https://needmet.in/blog/${article.id}/${article.slug || generateSlug(article.title)}`;
  const currentUrl = typeof window !== "undefined" ? window.location.href : canonicalUrl;

  const jsonLdSchema =
    article.seo?.schema_json_ld || {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: article.title,
      description: article.summary,
      image: article.coverImage ? [article.coverImage] : undefined,
      datePublished: article.publishedAt?.toISOString
        ? article.publishedAt.toISOString()
        : undefined,
      author: {
        "@type": "Organization",
        name: article.author?.name || "NeedMet Editorial",
      },
      publisher: {
        "@type": "Organization",
        name: "NeedMet",
        logo: {
          "@type": "ImageObject",
          url: "https://needmet.in/og-default.png",
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
    };

  const formattedBody = formatArticleContent(article);

  return (
    <>
      {/* ── 1. Top Reading Scroll Progress Bar ── */}
      <ArticleProgressBar />

      {/* ── Floating Sticky Share Bar (Visible when scrolling down on all devices) ── */}
      <div
        className={`fixed bottom-[80px] md:bottom-6 left-1/2 -translate-x-1/2 z-[9990] transition-all duration-300 ease-out ${
          showFloatingShare
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-8 pointer-events-none"
        }`}
        aria-hidden={!showFloatingShare}
      >
        <div className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-border/80 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          {/* Like Button for small devices */}
          <button
            type="button"
            onClick={handleToggleLike}
            disabled={toggleLikeMutation.isPending}
            className={`lg:hidden inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 shrink-0 ${
              toggleLikeMutation.isPending ? "opacity-70 cursor-not-allowed" : "cursor-pointer active:scale-95"
            } ${
              isLiked
                ? "bg-rose-500 hover:bg-rose-600 text-white shadow-xs"
                : "bg-surface-container-low hover:bg-rose-50 text-text hover:text-rose-600 border border-border/80"
            }`}
            title={isLiked ? "Unlike guide" : userLoggedIn ? "Like this guide" : "Log in to like this guide"}
          >
            <i
              className={`${
                isLiked ? "fa-solid fa-heart text-white" : "fa-regular fa-heart text-rose-500"
              } text-xs transition-transform`}
            ></i>
            <span className="text-[11px] font-semibold">{isLiked ? "Liked" : "Like"}</span>
            <span className="text-[11px] font-medium opacity-85">({article.likesCount || 0})</span>
          </button>

          <div className="lg:hidden w-px h-4 bg-border/80 shrink-0" />

          {/* Desktop Share Label */}
          <div className="hidden lg:flex items-center gap-1.5 text-text-secondary pl-0.5 select-none shrink-0">
            <i className="fa-solid fa-share-nodes text-primary text-xs sm:text-sm"></i>
            <span className="text-xs font-bold font-heading text-text tracking-wide">
              Share
            </span>
          </div>

          <div className="hidden lg:block w-px h-4 bg-border/80 shrink-0" />

          {/* Share Buttons */}
          <ArticleShareBar title={article.title} url={currentUrl} />
        </div>
      </div>

      {/* ── 2. SEO Injection ── */}
      <SEO
        title={`${article.title} | NeedMet Guides`}
        description={article.summary || `Read ${article.title} on NeedMet.`}
        canonicalUrl={canonicalUrl}
        image={article.coverImage}
        ogType="article"
        schema={jsonLdSchema}
      />

      <div className="min-h-screen bg-[#f8faf9] font-primary text-text">
        {/* ── Main Container ── */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10">
          
          {/* ── 2-Column Layout for Larger Device View ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
            
            {/* ══════════════════════════════════════════════════════════ */}
            {/* ── LEFT SIDE: Main Article Content & Header Details ── */}
            {/* ══════════════════════════════════════════════════════════ */}
            <article className="lg:col-span-8 space-y-4 sm:space-y-6 lg:space-y-7 min-w-0">
              
              {/* 2. Badges Row: Reading Time, Published Date */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-white border border-border text-text-secondary shadow-2xs">
                  <i className="fa-regular fa-clock text-[10px] text-primary"></i>
                  <span>{article.readingTime || 4} min read</span>
                </span>

                <span className="text-[11px] sm:text-xs text-text-secondary font-medium">
                  • {formattedDate}
                </span>
              </div>

              {/* 3. Article Headline */}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold font-heading text-text leading-[1.3] sm:leading-[1.25] tracking-tight m-0">
                {article.title}
              </h1>

              {/* 5. Author Byline Row & Quick Share / Like Bar */}
              <div className="pt-3.5 pb-1 border-t border-border/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2.5">
                {/* Author Info (One line on small devices) */}
                <div className="flex items-center gap-2.5 min-w-0">
                  {article.author?.avatar ? (
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-primary/20 shadow-2xs shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-2xs shrink-0">
                      {article.author?.name?.charAt(0)?.toUpperCase() || "N"}
                    </div>
                  )}
                  <div className="min-w-0 flex flex-col justify-center">
                    <p className="text-xs sm:text-sm font-bold text-text m-0 truncate leading-snug">
                      {article.author?.name || "NeedMet Editorial Team"}
                    </p>
                    <p className="text-[11px] sm:text-xs text-text-secondary m-0 truncate leading-snug">
                      {article.author?.role || "Local Guide & Reviewer"}
                    </p>
                  </div>
                </div>

                {/* Below on small devices: Like on left, Share Icons on right. On sm+: Share Icons on right */}
                <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto pt-2.5 sm:pt-0 border-t border-border/50 sm:border-t-0">
                  {/* Mobile-Only Like Button */}
                  <div className="sm:hidden">
                    <button
                      type="button"
                      onClick={handleToggleLike}
                      disabled={toggleLikeMutation.isPending}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-2xs ${
                        toggleLikeMutation.isPending ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
                      } ${
                        isLiked
                          ? "bg-rose-500 hover:bg-rose-600 text-white shadow-xs"
                          : "bg-surface-container-low hover:bg-rose-50 text-text hover:text-rose-600 border border-border/80"
                      }`}
                      title={isLiked ? "Unlike guide" : userLoggedIn ? "Like this guide" : "Log in to like this guide"}
                    >
                      <i className={isLiked ? "fa-solid fa-heart text-white" : "fa-regular fa-heart"}></i>
                      <span>{isLiked ? "Liked" : "Like"}</span>
                      <span className="text-[11px] font-semibold opacity-90">({article.likesCount || 0})</span>
                    </button>
                  </div>

                  {/* Quick Share Icons */}
                  <div className="flex items-center shrink-0">
                    <ArticleShareBar title={article.title} url={currentUrl} />
                  </div>
                </div>
              </div>

              {/* 6. Cover Hero Image with Fullscreen Button */}
              {article.coverImage && (
                <div className="relative w-full h-52 sm:h-72 md:h-[420px] lg:h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm bg-gradient-to-br from-primary-surface to-surface-green/20 border border-border/80 group/hero">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      if (!e.target.dataset.tried) {
                        e.target.dataset.tried = "true";
                        e.target.src = `https://wsrv.nl/?url=${encodeURIComponent(article.coverImage)}`;
                      }
                    }}
                    className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 group-hover/hero:scale-[1.015]"
                    onClick={() => handleOpenFullscreen(article.coverImage, article.title)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

                  {/* Top-Right: Fullscreen Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenFullscreen(article.coverImage, article.title);
                    }}
                    className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/55 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 shadow-md flex items-center justify-center text-xs sm:text-sm transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                    aria-label="View photo fullscreen"
                    title="View Fullscreen"
                  >
                    <i className="fa-solid fa-expand"></i>
                  </button>
                </div>
              )}

              {/* 7. Actual Article Content Body */}
              <div
                className="article-prose w-full pt-2"
                onClick={(e) => {
                  const target = e.target;
                  if (target && target.tagName === "IMG") {
                    const src = target.currentSrc || target.src;
                    if (src) {
                      handleOpenFullscreen(src, target.alt || article.title);
                    }
                  }
                }}
                dangerouslySetInnerHTML={{ __html: formattedBody }}
              />

              {/* 8. Tags Section */}
              {article.tags?.length > 0 && (
                <div className="pt-6 border-t border-border/80 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-text-secondary font-heading uppercase tracking-wider mr-1">
                    Related Tags:
                  </span>
                  {article.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white border border-border text-text-secondary hover:text-primary hover:border-primary/40 transition-colors shadow-2xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* End of Guide Marker */}
              <div className="pt-6 border-t border-border/80 flex items-center justify-between text-xs text-text-secondary">
                <span className="inline-flex items-center gap-2 font-medium">
                  <i className="fa-solid fa-flag-checkered text-primary"></i>
                  <span>End of Guide</span>
                </span>
                <span className="text-[11px] text-text-secondary/70">
                  {article.readingTime || 4} min read completed
                </span>
              </div>
            </article>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* ── RIGHT SIDE: Sticky Sidebar for Larger Device View ── */}
            {/* (Like & Dislike, Other Articles with Search) ── */}
            {/* ══════════════════════════════════════════════════════════ */}
            <aside className="hidden lg:block lg:col-span-4 sticky top-[80px] max-h-[calc(100vh-96px)] overflow-y-auto overscroll-contain pr-1.5 space-y-5 custom-scrollbar">
              
              {/* 1. Like Card */}
              <FeedbackCard
                isLiked={isLiked}
                likesCount={article.likesCount || 0}
                onToggleLike={handleToggleLike}
                userLoggedIn={userLoggedIn}
                isPending={toggleLikeMutation.isPending}
              />

              {/* 2. Other Articles with Live Search */}
              <OtherArticlesCard
                articles={topGuides}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onClearSearch={() => setSearchQuery("")}
                title="Top Guides"
                subtitle="Popular neighborhood stories"
              />

            </aside>

          </div>

          {/* ── 2. Guide End Section (Before Business CTA) ── */}
          <div ref={guideEndRef} id="guide-end-section">
            <GuideEndSection
            article={article}
            isLiked={isLiked}
            likesCount={article.likesCount || 0}
            onToggleLike={handleToggleLike}
            userLoggedIn={userLoggedIn}
            isLikePending={toggleLikeMutation.isPending}
            allGuides={otherArticles}
          />
          </div>

          {/* ── 3. Bottom Business CTA Section (Full Width, Existing Component) ── */}
          <div className="mt-14 sm:mt-16">
            <BusinessCTA bgColor="var(--primary-surface)" />
          </div>

        </div>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {fullscreenViewer.isOpen && (
        <FullscreenViewer
          images={fullscreenViewer.images}
          startIndex={fullscreenViewer.index}
          title={fullscreenViewer.title}
          onClose={() =>
            setFullscreenViewer({ isOpen: false, images: [], index: 0, title: "" })
          }
        />
      )}
    </>
  );
}

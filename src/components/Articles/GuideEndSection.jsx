import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import ArticleCard from "./ArticleCard.jsx";
import ArticleShareBar from "./ArticleShareBar.jsx";

/**
 * GuideEndSection
 * Displayed at the end of the guide reading page before the "List Your Business" (BusinessCTA) section.
 * Provides a celebratory guide completion banner, original descriptive context,
 * compact mobile-optimized engagement actions (icon-only like button on phone),
 * directory navigation buttons inline after text on larger devices (and 3-column grid on phone),
 * and a 2-column mobile / 3-column desktop grid of community guides with "View All" on the right.
 */
export default function GuideEndSection({
  article,
  isLiked = false,
  likesCount = 0,
  onToggleLike,
  userLoggedIn = false,
  isLikePending = false,
  allGuides = [],
  otherArticles = [],
}) {
  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://needmet.in/blog/${article?.slug || article?.id || ""}`;

  // Sort guides by date (descending, latest first)
  const sortedGuidesByDate = useMemo(() => {
    const list =
      Array.isArray(allGuides) && allGuides.length > 0
        ? allGuides
        : Array.isArray(otherArticles)
        ? otherArticles
        : [];

    return [...list].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.created_at || a.publishedAt || 0).getTime();
      const dateB = new Date(b.createdAt || b.created_at || b.publishedAt || 0).getTime();
      return dateB - dateA;
    });
  }, [allGuides, otherArticles]);

  return (
    <section
      aria-label="Guide Conclusion and Recommendations"
      className="mt-8 sm:mt-14 pt-6 sm:pt-10 border-t border-border/80 space-y-6 sm:space-y-10 font-primary"
    >
      {/* ── 1. Guide Completion & Engagement Banner ── */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary-surface/90 via-white to-surface-container-low/60 border border-primary/20 p-4 sm:p-7 md:p-8 shadow-2xs">
        {/* Subtle decorative background ambient glows */}
        <div
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-accent-emerald/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 space-y-4 sm:space-y-6">
          {/* Header Row: Title, Context Text, and Actions */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold font-heading bg-primary/10 text-primary border border-primary/20">
                <i className="fa-solid fa-flag-checkered text-[10px]"></i>
                <span>Guide Completed</span>
              </div>
              <h2 className="text-base sm:text-2xl md:text-3xl font-extrabold font-heading text-text tracking-tight m-0">
                Enjoyed this guide? Support & share!
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed m-0">
                You've reached the end of{" "}
                <strong className="text-text font-semibold">
                  "{article?.title || "this local guide"}"
                </strong>
                . NeedMet shares free neighborhood guides to help you discover authentic local businesses and community tips.
              </p>
            </div>

            {/* Action Bar (Like Button + Share Icons - Aligned at end of Y-axis on desktop) */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 pt-1 lg:pt-0 lg:self-end">
              {/* Like Button: Phone view shows only icon + count, no text */}
              <button
                type="button"
                onClick={onToggleLike}
                disabled={isLikePending}
                aria-pressed={isLiked}
                title={
                  isLiked
                    ? "Click to unlike this guide"
                    : userLoggedIn
                    ? "Like this guide"
                    : "Log in to like this guide"
                }
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-2xs ${
                  isLikePending ? "opacity-70 cursor-not-allowed" : ""
                } ${
                  isLiked
                    ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20"
                    : "bg-white hover:bg-rose-50 text-text hover:text-rose-600 border border-border"
                }`}
              >
                <i
                  className={`${
                    isLiked ? "fa-solid fa-heart scale-110" : "fa-regular fa-heart"
                  } text-xs sm:text-sm transition-transform`}
                ></i>
                {/* Text is hidden on phone, visible on larger screens */}
                <span className="hidden sm:inline">
                  {isLiked ? "You Liked This" : "Like"}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold ${
                    isLiked
                      ? "bg-white/20 text-white"
                      : "bg-surface-container-low text-text-secondary"
                  }`}
                >
                  {likesCount}
                </span>
              </button>

              {/* Share Bar */}
              <div className="bg-white/90 backdrop-blur-xs p-1 rounded-xl border border-border/80 flex items-center shadow-2xs">
                <ArticleShareBar
                  title={article?.title || "Local Guide on NeedMet"}
                  url={currentUrl}
                  showLabels={false}
                />
              </div>
            </div>
          </div>

          {/* Directory Quick Navigation: Inline after text on larger devices, 3-column grid on phone */}
          <div className="pt-3 sm:pt-4 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-text-secondary shrink-0">
              <i className="fa-solid fa-compass text-primary text-xs"></i>
              <span>Explore more local spots & services:</span>
            </div>

            <div className="grid grid-cols-3 sm:flex sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
              <Link
                to="/categories"
                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-xl bg-white hover:bg-primary-surface border border-border hover:border-primary/40 text-[11px] sm:text-xs font-semibold text-text hover:text-primary transition-all text-center no-underline shadow-2xs active:scale-95"
              >
                <i className="fa-solid fa-store text-[11px] sm:text-xs text-primary shrink-0"></i>
                <span className="truncate">Category</span>
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-xl bg-white hover:bg-primary-surface border border-border hover:border-primary/40 text-[11px] sm:text-xs font-semibold text-text hover:text-primary transition-all text-center no-underline shadow-2xs active:scale-95"
              >
                <i className="fa-solid fa-magnifying-glass text-[11px] sm:text-xs text-primary shrink-0"></i>
                <span className="truncate">Search</span>
              </Link>
              <Link
                to="/blogs"
                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-xl bg-primary text-white hover:bg-primary-hover text-[11px] sm:text-xs font-bold font-heading transition-all text-center no-underline shadow-xs active:scale-95"
              >
                <i className="fa-solid fa-book-open text-[11px] sm:text-xs shrink-0"></i>
                <span className="truncate">All Guides</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. All Guides (2 Columns on Phone, 3 Columns on Desktop) ── */}
      {sortedGuidesByDate.length > 0 && (
        <div className="space-y-4 sm:space-y-6">
          {/* Header row: Title on left, "View All" ALWAYS on the right */}
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-0.5 sm:space-y-1 min-w-0">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary font-heading">
                Explore More
              </span>
              <h3 className="text-base sm:text-xl md:text-2xl font-extrabold font-heading text-text tracking-tight m-0 truncate sm:whitespace-normal">
                Community Guides & Stories
              </h3>
            </div>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-primary hover:text-primary-light transition-colors group no-underline shrink-0 pb-0.5"
            >
              <span>View All</span>
              <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </div>

          {/* 2-Column Grid on Mobile Phone, 3-Column on Large Screens */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8">
            {sortedGuidesByDate.map((art) => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

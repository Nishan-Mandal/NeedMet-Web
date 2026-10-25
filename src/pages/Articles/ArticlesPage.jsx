import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { SEO, SystemState, BusinessCTA } from "../../components";
import {
  ArticleCard,
  FeaturedArticleCard,
  ArticleSkeleton,
  ArticlesPageSkeleton,
} from "../../components/Articles";
import { useArticlesInfinite } from "../../hooks/useArticles";
import NoDataImg from "../../assets/no_data.png";
import ErrorImg from "../../assets/error.png";

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const sentinelRef = useRef(null);

  // Query articles with Firebase inbuilt cursor pagination (startAfter) matching ListingsPage
  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useArticlesInfinite({
    quantity: 12,
  });

  // Flatten all pages of articles matching ListingsPage pattern
  const allArticles = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.articles || []);
  }, [data]);

  // Latest article is the very first one
  const latestArticle = useMemo(() => {
    if (allArticles.length > 0) return allArticles[0];
    return null;
  }, [allArticles]);

  // All other articles (excluding the top latest one when not searching)
  const otherArticles = useMemo(() => {
    if (!latestArticle) return allArticles;
    return allArticles.filter((a) => a.id !== latestArticle.id);
  }, [allArticles, latestArticle]);

  // Client-side search filter: searches across loaded articles when query is active
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) {
      return latestArticle ? otherArticles : allArticles;
    }
    const query = searchQuery.toLowerCase().trim();
    return allArticles.filter(
      (art) =>
        art.title?.toLowerCase().includes(query) ||
        art.summary?.toLowerCase().includes(query) ||
        art.category?.toLowerCase().includes(query) ||
        (Array.isArray(art.tags) && art.tags.some((t) => t.toLowerCase().includes(query)))
    );
  }, [allArticles, otherArticles, latestArticle, searchQuery]);

  // Infinite scroll intersection observer matching ListingsPage.jsx
  const handleObserver = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  // Full page skeleton loader while loading
  if (isLoading) {
    return <ArticlesPageSkeleton searchQuery={searchQuery} />;
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] font-primary text-text">
      <SEO
        title="Local Guides & Articles — NeedMet"
        description="Explore local business insights, how-to guides, repair checklists, and neighbourhood recommendations from NeedMet."
        canonicalUrl="https://needmet.in/articles"
      />

      {/* ── 1. Hero Showcase Header ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-surface/60 via-white to-[#f8faf9] border-b border-border/70 py-10 sm:py-14">
        {/* Ambient background glow circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden opacity-50">
          <div className="absolute -top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-10 right-1/4 w-80 h-80 bg-accent-emerald/15 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 text-center">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-surface border border-primary/20 text-primary text-xs sm:text-sm font-bold shadow-2xs mb-3">
            <i className="fa-solid fa-book-open-reader text-primary"></i>
            <span>NeedMet Knowledge Hub</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-text tracking-tight leading-[1.2] max-w-4xl mx-auto m-0">
            Local Insights,{" "}
            <span className="text-primary bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Guides & Neighborhood Stories
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto m-0">
            Discover expert advice, service hiring checklists, store spotlights, and neighbourhood tips curated by the NeedMet community.
          </p>
        </div>
      </section>

      {/* ── 2. Main Content Container (Full Width) ── */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 space-y-10">
        
        {/* ── 2A. Latest Article Hero Card (Top, when not searching) ── */}
        {!searchQuery && latestArticle && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary font-heading">
                Latest Guide
              </span>
            </div>
            <FeaturedArticleCard article={latestArticle} badgeText="Latest Guide" />
          </section>
        )}

        {/* ── 2B. Heading & Search Bar ── */}
        <section className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-text tracking-tight m-0">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : "More Guides & Articles"}
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1 m-0">
                {searchQuery
                  ? `Found ${filteredArticles.length} matching guide${filteredArticles.length === 1 ? "" : "s"}`
                  : "Explore verified local guides, tips, and insights"}
              </p>
            </div>

            {/* Keyword Search Input */}
            <div className="relative min-w-[260px] sm:min-w-[320px]">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary text-xs"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guides, tags..."
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white border border-border text-sm text-text placeholder:text-text-secondary/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text text-xs p-1 cursor-pointer"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── 2C. Articles Grid / Loading / Empty States ── */}
        <section className="space-y-8">
          {isLoading ? (
            <ArticleSkeleton count={6} />
          ) : isError ? (
            <SystemState
              imageSrc={ErrorImg}
              title="Failed to Load"
              highlight="Articles"
              message={
                error?.message ||
                "We could not fetch the articles at this moment. Please check your connection and try again."
              }
              actionType="custom"
              actionLabel="Retry"
              onActionClick={() => refetch()}
            />
          ) : filteredArticles.length === 0 ? (
            <div className="py-12 bg-white rounded-2xl border border-border/80 shadow-2xs text-center p-8">
              <SystemState
                imageSrc={NoDataImg}
                title="No Articles"
                highlight="Found"
                message={
                  searchQuery
                    ? `No articles matched your search query "${searchQuery}". Try different keywords.`
                    : "No articles published yet. Check back soon for more local guides!"
                }
                actionType={searchQuery ? "custom" : "none"}
                actionLabel={searchQuery ? "Clear Search" : undefined}
                onActionClick={searchQuery ? () => setSearchQuery("") : undefined}
              />
            </div>
          ) : (
            <>
              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {/* Incremental Page Loader (matching ListingsPage.jsx) */}
              {isFetchingNextPage && (
                <div className="pt-4">
                  <ArticleSkeleton count={3} />
                </div>
              )}

              {/* End of results message */}
              {!hasNextPage && !isFetchingNextPage && filteredArticles.length > 0 && (
                <p className="text-center text-xs text-text-secondary py-4 m-0">
                  You've reached the end of the guides.
                </p>
              )}

              {/* Infinite Scroll Sentinel element */}
              <div ref={sentinelRef} className="h-px w-full my-6" />
            </>
          )}
        </section>

        {/* ── 2D. Existing Business CTA Component (Standard, No Recreation) ── */}
        <div className="pt-6">
          <BusinessCTA bgColor="var(--primary-surface)" />
        </div>

      </main>
    </div>
  );
}

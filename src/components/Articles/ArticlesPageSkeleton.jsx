import React from "react";
import FeaturedArticleSkeleton from "./FeaturedArticleSkeleton.jsx";
import ArticleSkeleton from "./ArticleSkeleton.jsx";

export default function ArticlesPageSkeleton({ searchQuery = "" }) {
  return (
    <div className="min-h-screen bg-[#f8faf9] font-primary text-text animate-fadeIn">
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
        
        {/* ── 2A. Latest Article Hero Card Skeleton (Top, when not searching) ── */}
        {!searchQuery && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary font-heading">
                Latest Guide
              </span>
            </div>
            <FeaturedArticleSkeleton />
          </section>
        )}

        {/* ── 2B. Search Bar & Section Heading ── */}
        <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-text tracking-tight m-0">
              {searchQuery ? `Searching for "${searchQuery}"...` : "More Guides & Articles"}
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 m-0">
              Loading local verified guides and neighbourhood insights...
            </p>
          </div>

          {/* Keyword Search Input Placeholder */}
          <div className="relative min-w-[260px] sm:min-w-[320px]">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary text-xs"></i>
            <div className="w-full h-10 rounded-xl bg-white border border-border shadow-2xs flex items-center pl-9 pr-4 text-xs text-text-secondary/60">
              <div className="w-28 h-3.5 rounded skeleton-shimmer-subtle" />
            </div>
          </div>
        </section>

        {/* ── 2C. Articles Grid Skeleton ── */}
        <section className="space-y-8">
          <ArticleSkeleton count={6} />
        </section>

        {/* ── 2D. Bottom CTA Section Skeleton ── */}
        <div className="pt-6">
          <div className="w-full h-44 sm:h-52 rounded-3xl skeleton-shimmer border border-border/70 shadow-xs" />
        </div>
      </main>
    </div>
  );
}

import React from "react";

export default function ArticleDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-[#f8faf9] font-primary text-text animate-fadeIn">
      {/* ── Top Reading Progress Bar Placeholder (Subtle Themed Line) ── */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-primary/20 overflow-hidden">
        <div className="h-full w-1/3 skeleton-shimmer" />
      </div>

      {/* ── Main Container ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10">
        {/* ── 2-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
          
          {/* ══════════════════════════════════════════════════════════ */}
          {/* ── LEFT SIDE: Main Article Content Skeleton ── */}
          {/* ══════════════════════════════════════════════════════════ */}
          <article className="lg:col-span-8 space-y-4 sm:space-y-6 lg:space-y-7 min-w-0">
            
            {/* 1. Breadcrumb Navigation Skeleton */}
            <div className="flex items-center gap-2 text-xs">
              <div className="w-10 h-3.5 rounded skeleton-shimmer-subtle" />
              <span className="text-border">/</span>
              <div className="w-14 h-3.5 rounded skeleton-shimmer-subtle" />
              <span className="text-border">/</span>
              <div className="w-24 h-3.5 rounded skeleton-shimmer-subtle" />
            </div>

            {/* 2. Badges Row: Category, Reading Time, Published Date */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-24 h-6 sm:h-7 rounded-full skeleton-shimmer shadow-2xs" />
              <div className="w-24 h-6 sm:h-7 rounded-full skeleton-shimmer-subtle border border-border shadow-2xs" />
              <div className="w-28 h-4 rounded skeleton-shimmer-subtle ml-1" />
            </div>

            {/* 3. Article Headline Skeleton */}
            <div className="space-y-2.5 pt-1">
              <div className="w-full h-8 sm:h-10 lg:h-11 rounded-xl skeleton-shimmer" />
              <div className="w-4/5 h-8 sm:h-10 lg:h-11 rounded-xl skeleton-shimmer" />
            </div>

            {/* 4. Excerpt / Lead Summary Skeleton */}
            <div className="space-y-2 pt-1">
              <div className="w-full h-4 sm:h-5 rounded-md skeleton-shimmer-subtle" />
              <div className="w-11/12 h-4 sm:h-5 rounded-md skeleton-shimmer-subtle" />
            </div>

            {/* 5. Author Byline Row & Quick Share Bar */}
            <div className="pt-3.5 pb-1 border-t border-border/70 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full skeleton-shimmer shrink-0 border-2 border-primary/20 shadow-2xs" />
                <div className="space-y-1.5 min-w-0">
                  <div className="w-36 h-4 rounded skeleton-shimmer" />
                  <div className="w-24 h-3 rounded skeleton-shimmer-subtle" />
                </div>
              </div>

              {/* Share Icons Skeleton */}
              <div className="w-28 h-8 rounded-xl skeleton-shimmer-subtle shrink-0" />
            </div>

            {/* 6. Cover Hero Image Skeleton */}
            <div className="relative w-full h-52 sm:h-72 md:h-[420px] lg:h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden skeleton-shimmer border border-border/80 shadow-sm" />

            {/* 7. Actual Article Content Body Prose Skeleton */}
            <div className="w-full pt-4 space-y-6">
              {/* Paragraph 1 */}
              <div className="space-y-2.5">
                <div className="w-full h-4 rounded skeleton-shimmer-subtle" />
                <div className="w-[96%] h-4 rounded skeleton-shimmer-subtle" />
                <div className="w-[92%] h-4 rounded skeleton-shimmer-subtle" />
                <div className="w-2/3 h-4 rounded skeleton-shimmer-subtle" />
              </div>

              {/* Subheading H2 */}
              <div className="w-2/5 h-7 rounded-lg skeleton-shimmer pt-2" />

              {/* Paragraph 2 */}
              <div className="space-y-2.5">
                <div className="w-full h-4 rounded skeleton-shimmer-subtle" />
                <div className="w-[94%] h-4 rounded skeleton-shimmer-subtle" />
                <div className="w-4/5 h-4 rounded skeleton-shimmer-subtle" />
              </div>

              {/* Highlight / Callout Box Skeleton */}
              <div className="p-5 sm:p-6 rounded-2xl border-l-4 border-primary bg-primary-surface/40 space-y-2.5">
                <div className="w-1/4 h-4 rounded skeleton-shimmer" />
                <div className="w-full h-3.5 rounded skeleton-shimmer-subtle" />
                <div className="w-5/6 h-3.5 rounded skeleton-shimmer-subtle" />
              </div>

              {/* Subheading H2 */}
              <div className="w-1/3 h-7 rounded-lg skeleton-shimmer pt-2" />

              {/* Paragraph 3 */}
              <div className="space-y-2.5">
                <div className="w-full h-4 rounded skeleton-shimmer-subtle" />
                <div className="w-[97%] h-4 rounded skeleton-shimmer-subtle" />
                <div className="w-[90%] h-4 rounded skeleton-shimmer-subtle" />
                <div className="w-1/2 h-4 rounded skeleton-shimmer-subtle" />
              </div>

              {/* Bullet Points List Skeleton */}
              <div className="space-y-3 pl-2">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary/40 shrink-0" />
                    <div className="w-4/5 h-3.5 rounded skeleton-shimmer-subtle" />
                  </div>
                ))}
              </div>
            </div>

            {/* 8. Tags Section Skeleton */}
            <div className="pt-6 border-t border-border/80 flex flex-wrap items-center gap-2">
              <div className="w-20 h-4 rounded skeleton-shimmer-subtle mr-1" />
              {[1, 2, 3, 4].map((t) => (
                <div key={t} className="w-20 h-7 rounded-full skeleton-shimmer-subtle shadow-2xs" />
              ))}
            </div>

            {/* 9. Verified Sources & Citations Box Skeleton */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-border/80 shadow-2xs space-y-3.5">
              <div className="w-56 h-5 rounded-md skeleton-shimmer" />
              <div className="w-4/5 h-3.5 rounded skeleton-shimmer-subtle" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[1, 2].map((c) => (
                  <div key={c} className="p-3.5 rounded-xl bg-surface-container-low/60 border border-border space-y-2">
                    <div className="w-32 h-4 rounded skeleton-shimmer" />
                    <div className="w-full h-3 rounded skeleton-shimmer-subtle" />
                    <div className="w-3/4 h-3 rounded skeleton-shimmer-subtle" />
                  </div>
                ))}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* ── MOBILE VIEW ONLY: Feedback, Other Articles Skeleton ── */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div className="lg:hidden space-y-6 pt-4">
              {/* Mobile Feedback Card Skeleton */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-border/80 shadow-2xs space-y-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl skeleton-shimmer shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="w-40 h-4 rounded skeleton-shimmer" />
                    <div className="w-48 h-3 rounded skeleton-shimmer-subtle" />
                  </div>
                </div>
                <div className="flex items-center gap-2.5 pt-1">
                  <div className="flex-1 h-10 rounded-xl skeleton-shimmer" />
                  <div className="flex-1 h-10 rounded-xl skeleton-shimmer-subtle" />
                </div>
              </div>

              {/* Mobile Other Articles Skeleton */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-border/80 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-36 h-5 rounded skeleton-shimmer" />
                  <div className="w-14 h-4 rounded skeleton-shimmer-subtle" />
                </div>
                <div className="w-full h-9 rounded-xl skeleton-shimmer-subtle" />
                <div className="space-y-3 pt-1">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-3 rounded-2xl bg-surface-container-low/50 space-y-2">
                      <div className="w-full h-36 rounded-xl skeleton-shimmer" />
                      <div className="w-4/5 h-4 rounded skeleton-shimmer" />
                      <div className="w-2/3 h-3 rounded skeleton-shimmer-subtle" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </article>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* ── RIGHT SIDE: Sticky Sidebar Skeleton (Desktop) ── */}
          {/* ══════════════════════════════════════════════════════════ */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-[80px] space-y-5">
            {/* 1. Like & Dislike Feedback Card Skeleton */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-border/80 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary-surface/70 skeleton-shimmer shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-40 h-4 rounded skeleton-shimmer" />
                  <div className="w-48 h-3 rounded skeleton-shimmer-subtle" />
                </div>
              </div>
              <div className="flex items-center gap-2.5 pt-1">
                <div className="flex-1 h-10 rounded-xl skeleton-shimmer" />
                <div className="flex-1 h-10 rounded-xl skeleton-shimmer-subtle" />
              </div>
            </div>

            {/* 2. Other Articles Card Skeleton */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-border/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary-surface/70 skeleton-shimmer shrink-0" />
                  <div className="space-y-1">
                    <div className="w-32 h-4 rounded skeleton-shimmer" />
                    <div className="w-36 h-2.5 rounded skeleton-shimmer-subtle" />
                  </div>
                </div>
                <div className="w-12 h-3.5 rounded skeleton-shimmer-subtle" />
              </div>

              {/* Search bar placeholder */}
              <div className="w-full h-9 rounded-xl skeleton-shimmer-subtle" />

              {/* Mini cards */}
              <div className="space-y-3.5 pt-1">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="p-3 rounded-2xl bg-surface-container-low/50 shadow-2xs space-y-2.5"
                  >
                    {/* Thumbnail */}
                    <div className="w-full h-36 rounded-xl skeleton-shimmer relative overflow-hidden">
                      <div className="absolute top-2.5 left-2.5 w-16 h-5 rounded-full bg-white/80" />
                      <div className="absolute top-2.5 right-2.5 w-14 h-4 rounded-full bg-black/20" />
                    </div>

                    <div className="space-y-2">
                      <div className="w-11/12 h-4 rounded skeleton-shimmer" />
                      <div className="w-3/4 h-3 rounded skeleton-shimmer-subtle" />
                      <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                        <div className="w-16 h-3 rounded skeleton-shimmer-subtle" />
                        <div className="w-20 h-3.5 rounded skeleton-shimmer" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

        </div>

        {/* ── 3. Bottom Business CTA Section Skeleton ── */}
        <div className="mt-14 sm:mt-16">
          <div className="w-full h-44 sm:h-52 rounded-3xl skeleton-shimmer border border-border/70 shadow-xs" />
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  const [imgSrc, setImgSrc] = useState(article?.coverImage || "");
  const [triedFallback, setTriedFallback] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgSrc(article?.coverImage || "");
    setTriedFallback(false);
    setImgError(false);
  }, [article?.coverImage]);

  if (!article) return null;

  const handleImgError = () => {
    if (!triedFallback && imgSrc && !imgSrc.includes("wsrv.nl")) {
      setTriedFallback(true);
      setImgSrc(`https://wsrv.nl/?url=${encodeURIComponent(imgSrc)}`);
    } else {
      setImgError(true);
    }
  };

  const articleUrl = `/articles/${article.id}/${article.slug || ""}`;

  // Format date nicely (e.g., Oct 21, 2026)
  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <article className="group relative rounded-2xl bg-white overflow-hidden border border-border/80 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* ── Card Cover Image Container ── */}
      <div className="relative block w-full h-48 sm:h-52 overflow-hidden bg-gradient-to-br from-primary-surface via-surface-container-low to-surface-green/20">
        <Link to={articleUrl} className="block w-full h-full">
          {imgSrc && !imgError ? (
            <img
              src={imgSrc}
              alt={article.title}
              referrerPolicy="no-referrer"
              onError={handleImgError}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-primary/10 via-primary-surface/40 to-accent-emerald/10">
              <div className="w-12 h-12 rounded-xl bg-white/80 shadow-2xs flex items-center justify-center text-primary text-xl mb-2">
                <i className="fa-solid fa-newspaper"></i>
              </div>
              <span className="text-xs font-semibold text-primary font-heading tracking-wide uppercase">
                NeedMet Guide
              </span>
            </div>
          )}

          {/* Gradient Bottom Shadow on Image for Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
        </Link>

        {/* Top-Left: Category Badge */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold font-heading bg-white/95 text-primary shadow-xs backdrop-blur-xs border border-white/40">
            {article.category || "Local Guide"}
          </span>
        </div>

        {/* Top-Right: Reading Time Badge */}
        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/60 text-white backdrop-blur-md shadow-xs">
            <i className="fa-regular fa-clock text-[10px]"></i>
            <span>{article.readingTime || 3} min read</span>
          </span>
        </div>
      </div>

      {/* ── Card Body Content ── */}
      <div className="p-4 sm:px-5 sm:pt-4 sm:pb-4 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-1.5">
          {/* Article Title */}
          <h2 className="font-heading font-bold text-base sm:text-lg text-text group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug m-0">
            <Link to={articleUrl} className="hover:text-primary no-underline text-inherit">
              {article.title}
            </Link>
          </h2>

          {/* Excerpt / Summary */}
          {article.summary && (
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-2 sm:line-clamp-3 m-0 font-normal">
              {article.summary}
            </p>
          )}
        </div>

        {/* ── Card Footer: Date + Read Link ── */}
        <div className="pt-3 border-t border-border/70 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 text-xs text-text-secondary font-medium">
            <i className="fa-regular fa-calendar text-primary text-[11px]"></i>
            <span>{formattedDate}</span>
          </div>

          <Link
            to={articleUrl}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-primary-light transition-colors group/link no-underline"
          >
            <span>Read Guide</span>
            <i className="fa-solid fa-arrow-right text-[11px] group-hover/link:translate-x-1 transition-transform"></i>
          </Link>
        </div>
      </div>
    </article>
  );
}

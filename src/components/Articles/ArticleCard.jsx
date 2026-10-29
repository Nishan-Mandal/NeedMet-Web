import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { extractContentSnippet } from "../../data/model/articleModel.js";
import { useArticleLikeStatus, useToggleArticleLike } from "../../hooks/useArticles.js";
import { useAuth } from "../../contexts/authContext.jsx";
import { useToast } from "../../contexts/toastContext.jsx";

export default function ArticleCard({ article }) {
  const [imgSrc, setImgSrc] = useState(article?.coverImage || "");
  const [triedFallback, setTriedFallback] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  const { userLoggedIn } = useAuth();
  const { showToast } = useToast();
  const { data: isLiked = false } = useArticleLikeStatus(article?.id);
  const toggleLikeMutation = useToggleArticleLike();

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

  const handleToggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const fullUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/blog/${article.id}/${article.slug || ""}`
        : `https://needmet.in/blog/${article.id}/${article.slug || ""}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: `Read "${article.title}" on NeedMet`,
          url: fullUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          await navigator.clipboard.writeText(fullUrl);
          setCopied(true);
          showToast("Article link copied to clipboard!", "success");
          setTimeout(() => setCopied(false), 2500);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        showToast("Article link copied to clipboard!", "success");
        setTimeout(() => setCopied(false), 2500);
      } catch {
        showToast("Failed to copy link", "error");
      }
    }
  };

  const articleUrl = `/blog/${article.id}/${article.slug || ""}`;

  // Format date nicely (e.g., Oct 21, 2026)
  const formattedDate = article.createdAt || article.publishedAt
    ? new Date(article.createdAt || article.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  // Use starting content after heading as description
  const descriptionSnippet =
    (article?.contentMarkdown ? extractContentSnippet(article.contentMarkdown, 180) : "") ||
    article?.description ||
    article?.summary ||
    "";

  return (
    <article className="group relative rounded-2xl bg-white overflow-hidden border border-border/80 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* ── Card Cover Image Container ── */}
      <div className="relative block w-full h-32 sm:h-48 md:h-52 overflow-hidden bg-gradient-to-br from-primary-surface via-surface-container-low to-surface-green/20">
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
            <div className="w-full h-full flex flex-col items-center justify-center p-3 sm:p-6 text-center bg-gradient-to-br from-primary/10 via-primary-surface/40 to-accent-emerald/10">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-white/80 shadow-2xs flex items-center justify-center text-primary text-base sm:text-xl mb-1 sm:mb-2">
                <i className="fa-solid fa-newspaper"></i>
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-primary font-heading tracking-wide uppercase">
                NeedMet Guide
              </span>
            </div>
          )}

          {/* Gradient Bottom Shadow on Image for Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
        </Link>

        {/* Top-Left: Sleek Floating Glassmorphic Like & Share Pill */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 pointer-events-auto">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-black/55 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 shadow-xs transition-all duration-200">
            {/* Like Button */}
            <button
              type="button"
              onClick={handleToggleLike}
              disabled={toggleLikeMutation.isPending}
              className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold cursor-pointer transition-colors active:scale-90 ${
                isLiked ? "text-rose-400" : "text-white/90 hover:text-rose-300"
              }`}
              title={isLiked ? "Unlike guide" : "Like guide"}
            >
              <i className={`${isLiked ? "fa-solid fa-heart text-rose-400 scale-110" : "fa-regular fa-heart"} text-[10px] sm:text-xs transition-transform`}></i>
              <span className="text-[10px] sm:text-[11px] leading-none">{article.likesCount || 0}</span>
            </button>

            <div className="w-px h-2.5 sm:h-3 bg-white/30" />

            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              className={`text-[10px] sm:text-xs cursor-pointer transition-colors active:scale-90 ${
                copied ? "text-accent-emerald" : "text-white/90 hover:text-primary-light"
              }`}
              title={copied ? "Link Copied!" : "Share article"}
            >
              <i className={`fa-solid ${copied ? "fa-check text-accent-emerald" : "fa-share-nodes"} text-[10px] sm:text-[11px]`}></i>
            </button>
          </div>
        </div>

        {/* Top-Right: Reading Time Badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-black/55 text-white backdrop-blur-md shadow-xs border border-white/10">
            <i className="fa-regular fa-clock text-[9px] sm:text-[10px]"></i>
            <span>{article.readingTime || 3}m</span>
          </span>
        </div>
      </div>

      {/* ── Card Body Content ── */}
      <div className="p-3 sm:px-5 sm:pt-4 sm:pb-4 flex-1 flex flex-col justify-between gap-2 sm:gap-3">
        <div className="space-y-1 sm:space-y-1.5">
          {/* Article Title */}
          <h2 className="font-heading font-bold text-xs sm:text-base md:text-lg text-text group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug m-0">
            <Link to={articleUrl} className="hover:text-primary no-underline text-inherit">
              {article.title}
            </Link>
          </h2>

          {/* Excerpt / Summary (Starting content after heading) */}
          {descriptionSnippet && (
            <p className="text-[11px] sm:text-xs md:text-sm text-text-secondary leading-relaxed line-clamp-2 sm:line-clamp-3 m-0 font-normal">
              {descriptionSnippet}
            </p>
          )}
        </div>

        {/* ── Card Footer: Date + Read Link (Clean & Uncluttered) ── */}
        <div className="pt-2 sm:pt-3 border-t border-border/70 flex items-center justify-between">
          <div className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-text-secondary font-medium">
            <i className="fa-regular fa-calendar text-primary text-[10px] sm:text-[11px]"></i>
            <span className="truncate max-w-[70px] sm:max-w-none">{formattedDate}</span>
          </div>

          <Link
            to={articleUrl}
            className="inline-flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-bold text-primary hover:text-primary-light transition-colors group/link no-underline shrink-0"
          >
            <span>Read</span>
            <i className="fa-solid fa-arrow-right text-[9px] sm:text-[11px] group-hover/link:translate-x-1 transition-transform"></i>
          </Link>
        </div>
      </div>
    </article>
  );
}

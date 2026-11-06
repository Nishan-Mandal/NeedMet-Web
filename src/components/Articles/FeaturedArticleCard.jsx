import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { extractContentSnippet } from "../../data/model/articleModel.js";
import ArticleShareBar from "./ArticleShareBar.jsx";
import FullscreenViewer from "./FullscreenViewer.jsx";
import { useArticleLikeStatus, useToggleArticleLike } from "../../hooks/useArticles.js";
import { useAuth } from "../../contexts/authContext.jsx";
import { useToast } from "../../contexts/toastContext.jsx";

export default function FeaturedArticleCard({ article, badgeText = "Latest Guide" }) {
  const [imgSrc, setImgSrc] = useState(article?.coverImage || "");
  const [triedFallback, setTriedFallback] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const articleUrl = `/blog/${article.id}/${article.slug || ""}`;
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${article.id}/${article.slug || ""}`
      : `https://needmet.in/blog/${article.id}/${article.slug || ""}`;

  const formattedDate = article.createdAt || article.publishedAt
    ? new Date(article.createdAt || article.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  // Use starting content after heading as description
  const descriptionSnippet =
    (article?.contentMarkdown ? extractContentSnippet(article.contentMarkdown, 240) : "") ||
    article?.description ||
    article?.summary ||
    "";

  return (
    <div className="relative rounded-3xl bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      {/* Ambient background glow behind card */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
        {/* Left (or Top on mobile): Big Cover Image */}
        <div className="relative lg:col-span-7 h-64 sm:h-80 lg:h-[420px] overflow-hidden block group bg-gradient-to-br from-primary-surface to-surface-green/20">
          <Link to={articleUrl} className="block w-full h-full">
            {imgSrc && !imgError ? (
              <img
                src={imgSrc}
                alt={article.title}
                referrerPolicy="no-referrer"
                onError={handleImgError}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/10 via-primary-surface/50 to-accent-emerald/15">
                <div className="w-16 h-16 rounded-2xl bg-white/90 shadow-sm flex items-center justify-center text-primary text-2xl mb-3">
                  <i className="fa-solid fa-sparkles"></i>
                </div>
                <span className="text-sm font-bold text-primary font-heading uppercase tracking-wider">
                  {badgeText}
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />
          </Link>

          {/* Badges - Top-Left Featured badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold font-heading bg-primary text-white shadow-sm tracking-wide uppercase">
              <i className="fa-solid fa-sparkles text-[10px]"></i>
              <span>{badgeText}</span>
            </span>
          </div>

          {/* Top-Right Fullscreen Button */}
          {article?.coverImage && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsFullscreen(true);
              }}
              className="absolute top-4 right-4 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/55 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 shadow-md flex items-center justify-center text-xs sm:text-sm transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
              title="View Fullscreen"
              aria-label="View photo fullscreen"
            >
              <i className="fa-solid fa-expand"></i>
            </button>
          )}

          {/* Bottom-Right Reading Time */}
          <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/65 text-white backdrop-blur-md shadow-xs">
              <i className="fa-regular fa-clock text-[11px]"></i>
              <span>{article.readingTime || 5} min read</span>
            </span>
          </div>
        </div>

        {/* Right (or Bottom on mobile): Text, Social Actions & CTA */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between h-full space-y-5">
          <div className="space-y-3.5">
            {/* Meta Row: Badge & Date */}
            <div className="flex items-center gap-2.5 text-xs text-text-secondary font-medium">
              <span className="inline-flex items-center gap-1.5 text-primary font-bold">
                <i className="fa-solid fa-bolt text-accent-yellow"></i>
                <span>{badgeText}</span>
              </span>
              <span>•</span>
              <div className="inline-flex items-center gap-1 text-text-secondary font-medium">
                <i className="fa-regular fa-calendar text-primary text-xs"></i>
                <span>{formattedDate}</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-[2rem] text-text leading-tight tracking-tight m-0 hover:text-primary transition-colors">
              <Link to={articleUrl} className="text-inherit no-underline">
                {article.title}
              </Link>
            </h1>

            {/* Summary (Starting content after heading) */}
            {descriptionSnippet && (
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed line-clamp-3 sm:line-clamp-4 m-0 font-normal">
                {descriptionSnippet}
              </p>
            )}
          </div>

          {/* Dedicated Social Engagement & CTA Section */}
          <div className="pt-4 border-t border-border/80 space-y-3.5">
            {/* Engagement Row: Like Button on Left, Share Bar on Right */}
            <div className="flex items-center justify-between gap-3">
              {/* Like Button */}
              <button
                type="button"
                onClick={handleToggleLike}
                disabled={toggleLikeMutation.isPending}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border cursor-pointer active:scale-95 shadow-2xs ${
                  isLiked
                    ? "bg-rose-50 border-rose-200 text-rose-500 shadow-xs"
                    : "bg-surface-container-low hover:bg-rose-50 border-border/80 text-text hover:text-rose-600"
                }`}
                title={isLiked ? "Unlike guide" : "Like this guide"}
              >
                <i className={`${isLiked ? "fa-solid fa-heart text-rose-500 scale-110" : "fa-regular fa-heart text-rose-500"} text-xs transition-transform`}></i>
                <span>{isLiked ? "Liked" : "Like"}</span>
                <span className="text-[11px] font-semibold opacity-85">({article.likesCount || 0})</span>
              </button>

              {/* Share Bar */}
              <div className="flex items-center gap-1.5">
                <span className="hidden sm:inline text-xs font-semibold text-text-secondary font-heading">
                  Share:
                </span>
                <ArticleShareBar title={article.title} url={shareUrl} />
              </div>
            </div>

            {/* Prominent Read CTA */}
            <Link
              to={articleUrl}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-primary hover:bg-primary-light text-white font-heading font-bold text-sm shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 no-underline"
            >
              <span>Read Full Guide</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {isFullscreen && article?.coverImage && (
        <FullscreenViewer
          images={[article.coverImage]}
          startIndex={0}
          title={article.title}
          onClose={() => setIsFullscreen(false)}
        />
      )}
    </div>
  );
}

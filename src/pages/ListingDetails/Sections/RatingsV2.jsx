import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useReviews } from '../../../hooks/useReviews.js';
import { submitListingReview } from '../../../services/firebase/firestore/reviewService.js';

/* ──────────────────────────────────────────────────────────────
   RatingsV2.jsx — YouTube-Inspired Comments & Ratings Section
   - Compact, comment-style list (avatar, name, date, rating, body)
   - Collapsible preview on mobile (<sm) matching YouTube comments pattern
   - Expandable full review list with infinite scroll
   - Rating Summary Card (Score, Breakdown bars, Factor ratings)
─────────────────────────────────────────────────────────────── */

function getRatingLabel(rating) {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4) return "Very Good";
  if (rating >= 3) return "Good";
  if (rating >= 2) return "Average";
  return "Poor";
}

function renderStars(count, size = 'text-xs') {
  return [...Array(5)].map((_, i) => (
    <i
      key={i}
      className={`fa-solid fa-star ${size} ${i < count ? 'text-accent-yellow' : 'text-gray-200'}`}
    />
  ));
}

function getInitials(name) {
  if (!name || typeof name !== 'string') return 'A';
  const clean = name.trim();
  if (!clean) return 'A';
  return clean[0].toUpperCase();
}

function formatReviewDate(createdAt) {
  if (!createdAt) return 'Recently';
  let timestamp;
  if (createdAt?.seconds) {
    timestamp = createdAt.seconds * 1000;
  } else if (typeof createdAt === 'number') {
    timestamp = createdAt;
  } else if (createdAt instanceof Date) {
    timestamp = createdAt.getTime();
  } else {
    const d = new Date(createdAt);
    if (!isNaN(d.getTime())) timestamp = d.getTime();
  }

  if (!timestamp) return 'Recently';

  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  if (diffYears >= 1) return `${diffYears}y ago`;

  return new Date(timestamp).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/* ── YouTube-Style Comment Item Component ── */
function CommentItem({ review }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const commentText = review?.comment || '';
  const isLong = commentText.length > 160;
  const displayText = isLong && !isExpanded ? `${commentText.slice(0, 160)}...` : commentText;
  const name = review?.userName?.trim() || 'Anonymous User';
  const initial = getInitials(name);
  const dateStr = formatReviewDate(review?.createdAt);

  return (
    <div className="flex items-start gap-3 py-3 sm:py-3.5 border-b border-border/60 last:border-b-0 transition-colors">
      {/* Small circular avatar */}
      <div
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm font-heading text-white shrink-0 shadow-2xs select-none ring-1 ring-primary/20"
        style={{ background: 'linear-gradient(135deg, #0f5c3e 0%, #1a8a5a 100%)' }}
      >
        {initial}
      </div>

      {/* Review Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs sm:text-sm font-bold text-text truncate max-w-[150px] min-[400px]:max-w-[200px] sm:max-w-none">
            {name}
          </span>
          <span className="text-[11px] text-text-secondary font-medium">
            {dateStr}
          </span>
          {review?.rating > 0 && (
            <div className="flex items-center gap-0.5 ml-auto sm:ml-0" title={`${review.rating} of 5 stars`}>
              {renderStars(review.rating, 'text-[10px]')}
            </div>
          )}
        </div>

        {/* Comment Text with Wrap & Optional Read More */}
        <p className="text-xs sm:text-sm text-text/90 leading-relaxed mt-1 m-0 break-words whitespace-pre-line">
          {displayText}
        </p>

        {isLong && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[11px] sm:text-xs font-semibold text-primary hover:underline mt-1 p-0 bg-transparent border-0 cursor-pointer"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Main Component Export ── */
export default function RatingsV2({
  rating,
  review_count,
  ratingCount,
  ratingStats = {},
  avgRatings = {},
  listingId,
  openReviewModal,
}) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  useEffect(() => {
    if (openReviewModal) setShowReviewModal(true);
  }, [openReviewModal]);

  const queryClient = useQueryClient();

  const handleSubmitReview = async (factorRatings, comment) => {
    const response = await submitListingReview({ listingId, factorRatings, comment });
    if (response?.success) {
      await queryClient.invalidateQueries({ queryKey: ["reviews", listingId] });
      await queryClient.invalidateQueries({ queryKey: ["listingById", listingId] });
      setShowReviewModal(false);
    }
  };

  const { reviews, loading, hasMore, loadMore, isFetchingMore } = useReviews(listingId, 20);
  const validReviews = reviews.filter((r) => r.comment && r.comment.trim() !== "");

  const sentinelRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isFetchingMore) loadMore();
      },
      { root: listRef.current, threshold: 0.1, rootMargin: '50px' }
    );
    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, isFetchingMore, loadMore]);

  const totalReviewsCount = review_count || ratingCount || validReviews.length || 0;
  const overall = ((avgRatings.behaviour || 0) + (avgRatings.quality || 0) + (avgRatings.value || 0)) / 3;
  const previewReview = validReviews[0];

  return (
    <div className="flex flex-col gap-4 w-full font-primary">

      {/* ── Section Header ────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2.5 sm:gap-4 w-full">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary-surface text-primary flex items-center justify-center text-sm shrink-0">
            <i className="fa-solid fa-star"></i>
          </div>
          <div className="flex items-center gap-2 min-w-0 flex-wrap sm:flex-nowrap">
            <h2 className="text-base sm:text-xl lg:text-2xl font-bold font-heading text-text-accent m-0 whitespace-nowrap">
              Customer Reviews
            </h2>
            {totalReviewsCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent-yellow/15 text-amber-800 text-xs font-bold border border-accent-yellow/30 whitespace-nowrap shrink-0">
                <i className="fa-solid fa-star text-[10px] text-accent-yellow"></i>
                <span>{rating || '0.0'}</span>
                <span className="opacity-80">({totalReviewsCount})</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Rating Summary Card (Score | Breakdown | Factor Ratings) ── */}
      <div className="bg-white border border-border rounded-2xl shadow-sm p-4 sm:p-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

          {/* 1. Left Column: Overall Rating */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex items-baseline gap-2 leading-none">
              <span className="text-5xl font-black text-text font-heading tracking-tight">
                {ratingCount > 0 ? rating : '—'}
              </span>
              <span className="text-sm font-semibold text-text-secondary">out of 5</span>
            </div>

            <div className="flex items-center gap-1 my-2.5">
              {renderStars(Math.round(rating || 0), 'text-base')}
            </div>

            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary-surface text-primary text-xs font-bold border border-primary/15">
              {ratingCount > 0 ? getRatingLabel(rating) : 'No Ratings'}
            </span>

            <p className="text-xs text-text-secondary mt-2 m-0">
              Based on {totalReviewsCount} verified reviews
            </p>
          </div>

          {/* 2. Middle Column: Star Breakdown Bars */}
          <div className="lg:col-span-5 flex flex-col gap-2.5 lg:px-6 lg:border-x border-border/70">
            {['5', '4', '3', '2', '1'].map((star) => {
              const count = ratingStats[star] || 0;
              const percent = ratingCount > 0 ? Math.round((count / ratingCount) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-3 w-full">
                  <span className="text-xs font-bold text-text min-w-[28px] font-heading flex items-center gap-1">
                    {star} <i className="fa-solid fa-star text-[10px] text-accent-yellow"></i>
                  </span>
                  <div className="flex-1 h-2.5 bg-primary-surface rounded-full overflow-hidden border border-primary/10">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        background: 'linear-gradient(90deg, #0f5c3e 0%, #1a8a5a 100%)',
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-text-secondary min-w-[36px] text-right">
                    {percent}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* 3. Right Column: Factor Ratings */}
          <div className="lg:col-span-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-border/60">
              <span className="text-xs font-bold text-text uppercase tracking-wider font-heading">
                Factor Ratings
              </span>
              <span className="text-[11px] text-text-secondary font-medium">Ratings breakdown</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-primary-surface/40 border border-primary/10 flex flex-col items-center justify-center text-center">
                <span className="text-lg sm:text-xl font-bold font-heading text-primary leading-none">
                  {avgRatings.behaviour ? Number(avgRatings.behaviour).toFixed(1) : '—'}
                </span>
                <span className="text-xs font-semibold text-text-secondary mt-1">Staff Behaviour</span>
              </div>

              <div className="p-3 rounded-xl bg-primary-surface/40 border border-primary/10 flex flex-col items-center justify-center text-center">
                <span className="text-lg sm:text-xl font-bold font-heading text-primary leading-none">
                  {avgRatings.quality ? Number(avgRatings.quality).toFixed(1) : '—'}
                </span>
                <span className="text-xs font-semibold text-text-secondary mt-1">Service Quality</span>
              </div>

              <div className="p-3 rounded-xl bg-primary-surface/40 border border-primary/10 flex flex-col items-center justify-center text-center">
                <span className="text-lg sm:text-xl font-bold font-heading text-primary leading-none">
                  {avgRatings.value ? Number(avgRatings.value).toFixed(1) : '—'}
                </span>
                <span className="text-xs font-semibold text-text-secondary mt-1">Value for Money</span>
              </div>

              <div className="p-3 rounded-xl bg-primary-surface/40 border border-primary/10 flex flex-col items-center justify-center text-center">
                <span className="text-lg sm:text-xl font-bold font-heading text-primary leading-none">
                  {overall ? Number(overall).toFixed(1) : '—'}
                </span>
                <span className="text-xs font-semibold text-text-secondary mt-1">Overall Score</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Mobile YouTube-Style Collapsed Preview Box (<sm) ── */}
      {!isMobileExpanded && (
        <div
          onClick={() => setIsMobileExpanded(true)}
          className="sm:hidden w-full bg-white border border-border rounded-2xl p-4 shadow-sm cursor-pointer hover:border-primary/40 transition-all active:scale-[0.99]"
        >
          <div className="flex items-center justify-between pb-2.5 border-b border-border/50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-heading text-text">Reviews</span>
              <span className="text-xs font-semibold text-text-secondary">({totalReviewsCount})</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <span>View all</span>
              <i className="fa-solid fa-chevron-down text-[10px]"></i>
            </div>
          </div>

          {previewReview ? (
            <div className="flex items-start gap-2.5 pt-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-2xs select-none"
                style={{ background: 'linear-gradient(135deg, #0f5c3e 0%, #1a8a5a 100%)' }}
              >
                {getInitials(previewReview.userName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text/90 line-clamp-2 m-0 leading-relaxed">
                  <span className="font-bold text-text mr-1.5">{previewReview.userName}</span>
                  {previewReview.comment}
                </p>
                <span className="text-[10px] text-text-secondary mt-1 inline-block">
                  {formatReviewDate(previewReview.createdAt)}
                </span>
              </div>
            </div>
          ) : (
            <div className="py-2 text-center text-xs text-text-secondary">
              No reviews yet. Tap to view or write a review!
            </div>
          )}
        </div>
      )}

      {/* ── YouTube-Style Full Reviews List (Always on Desktop, Expanded on Mobile) ── */}
      <div
        className={`${
          isMobileExpanded ? 'flex' : 'hidden sm:flex'
        } flex-col bg-white border border-border rounded-2xl shadow-sm overflow-hidden transition-all`}
      >
        {/* Header bar */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold font-heading text-text m-0">
              Reviews ({totalReviewsCount})
            </h3>
            <span className="text-xs text-text-secondary hidden min-[480px]:inline">
              • {validReviews.length} loaded
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile collapse control */}
            <button
              type="button"
              onClick={() => setIsMobileExpanded(false)}
              className="sm:hidden flex items-center gap-1 text-xs font-semibold text-text-secondary hover:text-text px-2 py-1 rounded-lg bg-gray-50 border border-border/60"
            >
              <span>Collapse</span>
              <i className="fa-solid fa-chevron-up text-[10px]"></i>
            </button>

            <button
              type="button"
              onClick={() => setShowReviewModal(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark cursor-pointer bg-primary-surface px-2.5 py-1 rounded-lg border border-primary/20"
            >
              <i className="fa-regular fa-pen-to-square text-[11px]"></i>
              <span className="hidden min-[380px]:inline">Add review</span>
            </button>
          </div>
        </div>

        {/* Scrollable Comments List */}
        <div className="p-4 sm:p-6">
          {!loading && !isFetchingMore && !validReviews.length ? (
            <div className="text-center py-8">
              <i className="fa-regular fa-comment-dots text-3xl text-primary/30 mb-2 block"></i>
              <p className="text-sm font-semibold text-text mb-1">No community reviews yet</p>
              <p className="text-xs text-text-secondary max-w-xs mx-auto mb-3">
                Be the first to share your experience with this business!
              </p>
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-bold text-primary bg-primary-surface border border-primary/25 hover:bg-primary hover:text-white transition-all cursor-pointer"
                onClick={() => setShowReviewModal(true)}
              >
                Write the First Review
              </button>
            </div>
          ) : (
            <div
              className="flex flex-col gap-0 overflow-y-auto max-h-[500px] pr-1"
              ref={listRef}
            >
              {validReviews.map((review) => (
                <CommentItem key={review.id} review={review} />
              ))}

              {(loading || isFetchingMore) && (
                <div className="flex items-center justify-center py-4 gap-2 text-xs font-medium text-text-secondary">
                  <i className="fa-solid fa-spinner fa-spin text-primary"></i>
                  Loading more reviews...
                </div>
              )}
              <div ref={sentinelRef} style={{ height: '2px' }} />
            </div>
          )}
        </div>

        {/* Bottom Bar on Mobile when expanded */}
        <div className="sm:hidden px-4 py-3 border-t border-border/60 bg-gray-50/50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsMobileExpanded(false)}
            className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary"
          >
            <i className="fa-solid fa-chevron-up text-[10px]"></i>
            <span>Hide reviews</span>
          </button>
          <button
            type="button"
            onClick={() => setShowReviewModal(true)}
            className="text-xs font-bold text-primary hover:underline"
          >
            Write a review
          </button>
        </div>
      </div>

      {/* ── Add Review Modal ─────────────────────────────────── */}
      <AddReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        listingName="This Listing"
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}

/* ─── Add Review Modal (Preserved from original) ─────────── */
export function AddReviewModal({ isOpen, onClose, onSubmit, listingName }) {
  const [factorRatings, setFactorRatings] = useState({ behaviour: 0, quality: 0, value: 0 });
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);

  const handleRating = (factor, value) => {
    setFactorRatings((prev) => ({ ...prev, [factor]: value }));
  };

  const renderModalStars = (factor) => {
    return [...Array(5)].map((_, i) => {
      const value = i + 1;
      return (
        <i
          key={value}
          className={`cursor-pointer transition-transform hover:scale-110 text-xl ${
            value <= factorRatings[factor] ? "fa-solid fa-star text-accent-yellow" : "fa-regular fa-star text-primary/30"
          }`}
          onClick={() => handleRating(factor, value)}
        />
      );
    });
  };

  const submitReview = async () => {
    try {
      setIsSubmitting(true);
      await onSubmit(factorRatings, comment);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    factorRatings.behaviour > 0 ||
    factorRatings.quality > 0 ||
    factorRatings.value > 0 ||
    comment.trim() !== "";

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/45 backdrop-blur-sm flex justify-center items-center z-[99999] p-4 animate-[fadeIn_0.2s_ease]"
      onClick={handleOverlayClick}
    >
      <div
        className="w-full max-w-[520px] bg-surface border border-primary/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative flex flex-col gap-5 sm:gap-6 shadow-2xl font-primary"
        ref={modalRef}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold text-text-accent font-heading m-0">
            Rate {listingName}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-background-secondary text-text-secondary hover:bg-primary-surface hover:text-primary flex items-center justify-center text-lg cursor-pointer transition-all hover:rotate-90 border-none"
            aria-label="Close review modal"
          >
            <i className="fa-regular fa-circle-xmark"></i>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm sm:text-base font-semibold text-text m-0">Owner's Behaviour</p>
          <div className="flex items-center gap-2">{renderModalStars("behaviour")}</div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm sm:text-base font-semibold text-text m-0">Service / Product Quality</p>
          <div className="flex items-center gap-2">{renderModalStars("quality")}</div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm sm:text-base font-semibold text-text m-0">Value for Money</p>
          <div className="flex items-center gap-2">{renderModalStars("value")}</div>
        </div>

        <textarea
          placeholder="Write your experience (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full min-h-[120px] sm:min-h-[140px] resize-none border border-border rounded-xl p-3.5 bg-background text-text text-sm leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
        />

        <button
          onClick={submitReview}
          disabled={!isFormValid || isSubmitting}
          className="w-full border-none text-white p-3.5 rounded-xl text-base font-bold font-primary cursor-pointer hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #0f5c3e 0%, #1a8a5a 100%)' }}
        >
          {isSubmitting ? (
            <>
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </button>
      </div>
    </div>
  );
}

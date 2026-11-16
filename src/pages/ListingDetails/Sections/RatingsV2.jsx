import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useReviews } from '../../../hooks/useReviews.js';
import { submitListingReview } from '../../../services/firebase/firestore/reviewService.js';
import { useAuth } from '../../../contexts/authContext.jsx';
import { useToast } from '../../../contexts/toastContext.jsx';

/* ──────────────────────────────────────────────────────────────
   RatingsV2.jsx — Community Reviews & Ratings Section
   - When ratings exist: Full Rating Summary Card (Score, Breakdown bars, Factor ratings) + Reviews list
   - When 0 ratings: Clean "Add your review" message box without 0 rating UI
   - Compact, comment-style list (avatar, name, date, rating, body)
   - Add Review Modal with quick overall rating & detailed factor ratings
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

/* ── Review Card Component ── */
function CommentItem({ review }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const commentText = review?.comment || '';
  const isLong = commentText.length > 160;
  const displayText = isLong && !isExpanded ? `${commentText.slice(0, 160)}...` : commentText;
  const name = review?.userName?.trim() || 'Anonymous User';
  const initial = getInitials(name);
  const dateStr = formatReviewDate(review?.createdAt);

  return (
    <div className="flex flex-col justify-between gap-3 p-4 rounded-xl border border-border/80 bg-gray-50/40 hover:bg-white hover:border-primary/30 box-shadow transition-all duration-150">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs font-heading text-white shrink-0 shadow-2xs select-none ring-1 ring-primary/20"
              style={{ background: 'linear-gradient(135deg, #0f5c3e 0%, #1a8a5a 100%)' }}
            >
              {initial}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-text truncate m-0 font-heading" title={name}>
                {name}
              </h4>
              <span className="text-[11px] text-text-secondary font-medium block">
                {dateStr}
              </span>
            </div>
          </div>

          {review?.rating > 0 && (
            <div className="flex items-center gap-0.5 shrink-0 pt-0.5" title={`${review.rating} of 5 stars`}>
              {renderStars(review.rating, 'text-[11px] sm:text-xs')}
            </div>
          )}
        </div>

        <p className="text-xs sm:text-sm text-text/90 leading-relaxed m-0 break-words whitespace-pre-line">
          {displayText}
        </p>
      </div>

      {isLong && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[11px] sm:text-xs font-semibold text-primary hover:underline self-start p-0 bg-transparent border-0 cursor-pointer"
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
}

/* ── Main Component Export ── */
export default function RatingsV2({
  listingName = 'This Business',
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
  const [initialSelectedRating, setInitialSelectedRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const { currentUser, userData } = useAuth() || {};
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (openReviewModal) setShowReviewModal(true);
  }, [openReviewModal]);

  const handleSubmitReview = async (factorRatings, comment) => {
    const response = await submitListingReview({
      listingId,
      factorRatings,
      comment,
      user: currentUser || userData,
    });
    if (response?.success) {
      showToast('Thank you! Your review has been submitted.', 'success');
      await queryClient.invalidateQueries({ queryKey: ["reviews", listingId] });
      await queryClient.invalidateQueries({ queryKey: ["listingById", listingId] });
      setShowReviewModal(false);
    } else {
      showToast(response?.message || 'Failed to submit review. Please try again.', 'error');
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

  const totalReviewsCount = Number(review_count || ratingCount || validReviews.length || reviews.length || 0);
  const numericRating = Number(rating || 0);
  const factorAverage =
    ((Number(avgRatings?.behaviour || 0)) +
     (Number(avgRatings?.quality || 0)) +
     (Number(avgRatings?.value || 0))) / 3;
  const displayRating = numericRating > 0 ? numericRating : (factorAverage > 0 ? Number(factorAverage.toFixed(1)) : 0);
  const hasRatings = Boolean(displayRating > 0 || totalReviewsCount > 0 || validReviews.length > 0);

  const totalStatsCount =
    Object.values(ratingStats).reduce((acc, val) => acc + (Number(val) || 0), 0) ||
    ratingCount ||
    totalReviewsCount ||
    0;

  const previewReview = validReviews[0];

  const handleOpenAddRating = (prefillStars = 5) => {
    setInitialSelectedRating(prefillStars);
    setShowReviewModal(true);
  };

  // ── Case 1: When there are NO ratings / reviews (0 Rating State) ──
  // Replaces the 0 rating UI with "Add your review" message box
  if (!hasRatings) {
    return (
      <div className="flex flex-col gap-4 w-full font-primary">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2.5 sm:gap-4 w-full">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary-surface text-primary flex items-center justify-center text-sm shrink-0">
              <i className="fa-solid fa-star"></i>
            </div>
            <h2 className="text-base sm:text-xl lg:text-2xl font-bold font-heading text-text-accent m-0 whitespace-nowrap">
              Customer Reviews
            </h2>
          </div>

          <button
            type="button"
            onClick={() => handleOpenAddRating(5)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-primary bg-primary-surface border border-primary/25 hover:bg-primary hover:text-white transition-all cursor-pointer shadow-2xs hover:shadow active:scale-95 shrink-0"
          >
            <i className="fa-solid fa-star text-[11px] text-accent-yellow"></i>
            <span>Add your review</span>
          </button>
        </div>

        {/* Clean Message Box replacing the 0 Rating UI */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-md sm:shadow-lg p-6 sm:p-10 text-center flex flex-col items-center justify-center gap-3.5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary-surface text-primary flex items-center justify-center text-xl sm:text-2xl shadow-2xs">
            <i className="fa-regular fa-comment-dots"></i>
          </div>

          <div className="max-w-md">
            <h3 className="text-base sm:text-lg font-bold font-heading text-text-accent m-0">
              No reviews yet
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-1.5 m-0 leading-relaxed">
              Be the first to share your experience with <span className="font-semibold text-text">{listingName}</span>. Add your review and help the community!
            </p>
          </div>

          {/* Interactive 5-Star Rating row */}
          <div
            className="flex items-center gap-2 my-1 cursor-pointer group"
            title="Click to rate"
          >
            {[1, 2, 3, 4, 5].map((starVal) => {
              const isLit = hoverRating > 0 ? starVal <= hoverRating : false;
              return (
                <i
                  key={starVal}
                  onMouseEnter={() => setHoverRating(starVal)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleOpenAddRating(starVal)}
                  className={`fa-solid fa-star text-2xl sm:text-3xl transition-transform hover:scale-125 ${
                    isLit ? 'text-accent-yellow' : 'text-gray-200'
                  }`}
                />
              );
            })}
          </div>

          {/* Main Action Button */}
          <button
            type="button"
            onClick={() => handleOpenAddRating(5)}
            className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer hover:-translate-y-0.5 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #0f5c3e 0%, #1a8a5a 100%)' }}
          >
            <i className="fa-solid fa-star text-accent-yellow text-xs"></i>
            <span>Add your review</span>
          </button>
        </div>

        {/* Add Review Modal */}
        <AddReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          listingName={listingName}
          initialRating={initialSelectedRating}
          onSubmit={handleSubmitReview}
        />
      </div>
    );
  }

  // ── Case 2: When ratings/reviews exist (Full Rating Summary & Reviews UI) ──
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
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent-yellow/15 text-amber-800 text-xs font-bold border border-accent-yellow/30 whitespace-nowrap shrink-0">
              <i className="fa-solid fa-star text-[10px] text-accent-yellow"></i>
              <span>{displayRating.toFixed(1)}</span>
              <span className="opacity-80">({totalReviewsCount})</span>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleOpenAddRating(5)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold text-primary bg-primary-surface border border-primary/25 hover:bg-primary hover:text-white transition-all cursor-pointer shadow-2xs hover:shadow active:scale-95 shrink-0"
        >
          <i className="fa-solid fa-star text-[11px] text-accent-yellow"></i>
          <span>Add your review</span>
        </button>
      </div>

      {/* ── Rating Summary Card (Score | Breakdown | Factor Ratings) ── */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-md sm:shadow-lg p-4 sm:p-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

          {/* 1. Left Column: Overall Rating */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex items-baseline gap-2 leading-none">
              <span className="text-4xl sm:text-5xl font-black text-text font-heading tracking-tight">
                {displayRating.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-text-secondary">out of 5</span>
            </div>

            <div className="flex items-center gap-1 my-2.5">
              {renderStars(Math.round(displayRating || 0), 'text-base')}
            </div>

            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary-surface text-primary text-xs font-bold border border-primary/15">
              {getRatingLabel(displayRating)}
            </span>

            <p className="text-xs text-text-secondary mt-2 m-0">
              Based on {totalReviewsCount} verified review{totalReviewsCount === 1 ? '' : 's'}
            </p>

            <button
              type="button"
              onClick={() => handleOpenAddRating(5)}
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:shadow transition-all cursor-pointer hover:-translate-y-0.5 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #0f5c3e 0%, #1a8a5a 100%)' }}
            >
              <i className="fa-solid fa-star text-[11px] text-accent-yellow"></i>
              <span>Add your review</span>
            </button>
          </div>

          {/* 2. Middle Column: Star Breakdown Bars */}
          <div className="lg:col-span-5 flex flex-col gap-2.5 lg:px-6 lg:border-x border-border/70">
            {['5', '4', '3', '2', '1'].map((star) => {
              const count = ratingStats[star] || 0;
              const percent = totalStatsCount > 0 ? Math.round((count / totalStatsCount) * 100) : 0;
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
                  {avgRatings?.behaviour && Number(avgRatings.behaviour) > 0 ? Number(avgRatings.behaviour).toFixed(1) : '—'}
                </span>
                <span className="text-xs font-semibold text-text-secondary mt-1">Staff Behaviour</span>
              </div>

              <div className="p-3 rounded-xl bg-primary-surface/40 border border-primary/10 flex flex-col items-center justify-center text-center">
                <span className="text-lg sm:text-xl font-bold font-heading text-primary leading-none">
                  {avgRatings?.quality && Number(avgRatings.quality) > 0 ? Number(avgRatings.quality).toFixed(1) : '—'}
                </span>
                <span className="text-xs font-semibold text-text-secondary mt-1">Service Quality</span>
              </div>

              <div className="p-3 rounded-xl bg-primary-surface/40 border border-primary/10 flex flex-col items-center justify-center text-center">
                <span className="text-lg sm:text-xl font-bold font-heading text-primary leading-none">
                  {avgRatings?.value && Number(avgRatings.value) > 0 ? Number(avgRatings.value).toFixed(1) : '—'}
                </span>
                <span className="text-xs font-semibold text-text-secondary mt-1">Value for Money</span>
              </div>

              <div className="p-3 rounded-xl bg-primary-surface/40 border border-primary/10 flex flex-col items-center justify-center text-center">
                <span className="text-lg sm:text-xl font-bold font-heading text-primary leading-none">
                  {factorAverage > 0 ? Number(factorAverage).toFixed(1) : '—'}
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
          className="sm:hidden w-full bg-white border border-slate-200/80 rounded-2xl p-4 shadow-md sm:shadow-lg cursor-pointer hover:border-primary/40 transition-all active:scale-[0.99]"
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

          {previewReview && (
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
          )}
        </div>
      )}

      {/* ── YouTube-Style Full Reviews List ── */}
      <div
        className={`${
          isMobileExpanded ? 'flex' : 'hidden sm:flex'
        } flex-col bg-white border border-slate-200/80 rounded-2xl shadow-md sm:shadow-lg overflow-hidden transition-all`}
      >
        <div className="px-4 sm:px-6 py-3.5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold font-heading text-text m-0">
              Reviews ({totalReviewsCount})
            </h3>
            {validReviews.length > 0 && (
              <span className="text-xs text-text-secondary hidden min-[480px]:inline">
                • {validReviews.length} loaded
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
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
              onClick={() => handleOpenAddRating(5)}
              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark cursor-pointer bg-primary-surface px-2.5 py-1 rounded-lg border border-primary/20"
            >
              <i className="fa-regular fa-pen-to-square text-[11px]"></i>
              <span className="hidden min-[380px]:inline">Add your review</span>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 overflow-y-auto max-h-[540px] pr-1"
            ref={listRef}
          >
            {validReviews.map((review) => (
              <CommentItem key={review.id} review={review} />
            ))}

            {(loading || isFetchingMore) && (
              <div className="col-span-full flex items-center justify-center py-4 gap-2 text-xs font-medium text-text-secondary">
                <i className="fa-solid fa-spinner fa-spin text-primary"></i>
                Loading more reviews...
              </div>
            )}
            <div ref={sentinelRef} className="col-span-full" style={{ height: '2px' }} />
          </div>
        </div>

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
            onClick={() => handleOpenAddRating(5)}
            className="text-xs font-bold text-primary hover:underline"
          >
            Add your review
          </button>
        </div>
      </div>

      {/* Add Review Modal */}
      <AddReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        listingName={listingName}
        initialRating={initialSelectedRating}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}

/* ─── Add Review Modal ────────────────────────────────────── */
export function AddReviewModal({
  isOpen,
  onClose,
  onSubmit,
  listingName = 'This Business',
  initialRating = 5,
}) {
  const [overallRating, setOverallRating] = useState(initialRating || 5);
  const [factorRatings, setFactorRatings] = useState({
    behaviour: initialRating || 5,
    quality: initialRating || 5,
    value: initialRating || 5,
  });
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const defaultRating = initialRating > 0 ? initialRating : 5;
      setOverallRating(defaultRating);
      setFactorRatings({
        behaviour: defaultRating,
        quality: defaultRating,
        value: defaultRating,
      });
      setComment("");
    }
  }, [isOpen, initialRating]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleOverallClick = (val) => {
    setOverallRating(val);
    setFactorRatings({
      behaviour: val,
      quality: val,
      value: val,
    });
  };

  const handleRating = (factor, value) => {
    setFactorRatings((prev) => {
      const updated = { ...prev, [factor]: value };
      const vals = Object.values(updated).filter((v) => v > 0);
      if (vals.length > 0) {
        setOverallRating(Math.round(vals.reduce((a, b) => a + b, 0) / vals.length));
      }
      return updated;
    });
  };

  const renderModalStars = (factor) => {
    return [...Array(5)].map((_, i) => {
      const value = i + 1;
      return (
        <i
          key={value}
          className={`cursor-pointer transition-transform hover:scale-110 text-xl ${
            value <= (factorRatings[factor] || 0)
              ? "fa-solid fa-star text-accent-yellow"
              : "fa-regular fa-star text-primary/30"
          }`}
          onClick={() => handleRating(factor, value)}
          title={`Rate ${value} star${value > 1 ? 's' : ''}`}
        />
      );
    });
  };

  const renderOverallStars = () => {
    return [...Array(5)].map((_, i) => {
      const value = i + 1;
      return (
        <i
          key={value}
          className={`cursor-pointer transition-transform hover:scale-110 text-2xl sm:text-3xl ${
            value <= overallRating
              ? "fa-solid fa-star text-accent-yellow"
              : "fa-regular fa-star text-primary/30"
          }`}
          onClick={() => handleOverallClick(value)}
          title={`Rate ${value} star${value > 1 ? 's' : ''}`}
        />
      );
    });
  };

  const submitReview = async () => {
    try {
      setIsSubmitting(true);
      const fallbackVal = overallRating > 0 ? overallRating : 5;
      const finalFactors = {
        behaviour: factorRatings.behaviour || fallbackVal,
        quality: factorRatings.quality || fallbackVal,
        value: factorRatings.value || fallbackVal,
      };
      await onSubmit(finalFactors, comment);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    overallRating > 0 ||
    factorRatings.behaviour > 0 ||
    factorRatings.quality > 0 ||
    factorRatings.value > 0;

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
        className="w-full max-w-[520px] max-h-[90vh] overflow-y-auto bg-surface border border-primary/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 relative flex flex-col gap-4 sm:gap-5 shadow-2xl font-primary"
        ref={modalRef}
      >
        {/* Header */}
        <div className="flex justify-between items-start gap-3 pb-2 border-b border-border/50">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-text-accent font-heading m-0">
              Rate {listingName}
            </h2>
            <p className="text-xs text-text-secondary m-0 mt-0.5">
              Share your rating and feedback with the community
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-background-secondary text-text-secondary hover:bg-primary-surface hover:text-primary flex items-center justify-center text-lg cursor-pointer transition-all hover:rotate-90 border-none shrink-0"
            aria-label="Close review modal"
          >
            <i className="fa-regular fa-circle-xmark"></i>
          </button>
        </div>

        {/* Quick Overall Rating */}
        <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-primary-surface/40 border border-primary/15 text-center gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-text font-heading">
            Overall Rating
          </span>
          <div className="flex items-center gap-2.5 my-1">
            {renderOverallStars()}
          </div>
          <span className="text-xs font-semibold text-primary">
            {overallRating > 0 ? getRatingLabel(overallRating) : 'Select rating'}
          </span>
        </div>

        {/* Factor Breakdown */}
        <div className="flex flex-col gap-3 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary font-heading">
              Detailed Factor Ratings
            </span>
            <span className="text-[11px] text-text-secondary italic">Optional breakdown</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/70 border border-border/60">
            <span className="text-xs sm:text-sm font-semibold text-text">Staff Behaviour</span>
            <div className="flex items-center gap-1.5">{renderModalStars("behaviour")}</div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/70 border border-border/60">
            <span className="text-xs sm:text-sm font-semibold text-text">Service / Quality</span>
            <div className="flex items-center gap-1.5">{renderModalStars("quality")}</div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/70 border border-border/60">
            <span className="text-xs sm:text-sm font-semibold text-text">Value for Money</span>
            <div className="flex items-center gap-1.5">{renderModalStars("value")}</div>
          </div>
        </div>

        {/* Comment textarea */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-text">
            Your Review <span className="text-text-secondary font-normal">(optional)</span>
          </label>
          <textarea
            placeholder="Share details of your experience with this business..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full min-h-[100px] resize-none border border-border rounded-xl p-3 bg-background text-text text-sm leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
          />
        </div>

        {/* Submit button */}
        <button
          onClick={submitReview}
          disabled={!isFormValid || isSubmitting}
          className="w-full border-none text-white p-3.5 rounded-xl text-sm sm:text-base font-bold font-primary cursor-pointer hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #0f5c3e 0%, #1a8a5a 100%)' }}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-spinner fa-spin"></i>
              <span>Submitting review...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-star text-accent-yellow"></i>
              <span>Submit Rating & Review</span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

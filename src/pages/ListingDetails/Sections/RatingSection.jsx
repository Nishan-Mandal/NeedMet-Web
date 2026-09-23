import { useReviews } from '../../../hooks/useReviews.js';
import { submitListingReview } from '../../../services/firebase/firestore/reviewService.js';
import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query';

function RatingSection({ rating, review_count, ratingCount, ratingStats, avgRatings = {}, listingId, openReviewModal }) {
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    if(openReviewModal) {
      setShowReviewModal(true);
    }
  }, [openReviewModal]);

  const queryClient = useQueryClient();

  const handleSubmitReview = async (factorRatings, comment) => {
    const response = await submitListingReview({
      listingId,
      factorRatings,
      comment,
    });

    if (response.success) {
      await queryClient.invalidateQueries({
        queryKey: ["reviews", listingId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["listingById", listingId],
      });
      
      setShowReviewModal(false);
    }
  };
  
  let maxRating = 0;
  ['5', '4', '3','2', '1'].forEach((star) => {
    maxRating = Math.max(maxRating || 0, ratingStats[star] || 0);
  });

  const renderStars = (count) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <i
                key={i}
                className={`fa-solid fa-star ${i <= count ? 'text-accent-yellow' : 'text-gray-300'}`}
            ></i>
        )
    }
    return stars
  }

  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4) return "Very Good";
    if (rating >= 3) return "Good";
    if (rating >= 2) return "Average";
    return "Poor";
  };

  const overall = ((avgRatings.behaviour || 0) + (avgRatings.quality || 0) + (avgRatings.value || 0)) / 3;
  const getPercent = (val) => Math.round(((val || 0) / 5) * 100);

  const { reviews, loading, hasMore, loadMore, isFetchingMore } = useReviews(listingId, 20);
  const validReviews = reviews.filter((review) => review.comment && review.comment.trim() !== "");

  const sentinelRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isFetchingMore) {
          loadMore();
        }
      },
      { 
        root: listRef.current,
        threshold: 0.1, 
        rootMargin: '50px' 
      }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };

  }, [hasMore, isFetchingMore, loadMore]);

  return (
    <div className="flex flex-col justify-center items-center w-full font-primary">
      <div className="w-full bg-surface border border-border shadow-[0_4px_10px_rgba(15,92,63,0.226),0_1px_2px_rgba(0,0,0,0.11)] rounded-[1rem] max-[1180px]:rounded-[0.9rem] max-[480px]:rounded-[0.85rem] p-[1.4rem] max-[1180px]:p-[1.1rem] max-[480px]:p-[1rem] flex flex-col justify-center items-center gap-8 max-[1180px]:gap-[1.4rem] font-primary">
        <div className="w-full flex justify-center items-center">
          <h2 className="font-heading font-bold text-[1.2rem] max-[480px]:text-[1rem] text-text-accent flex items-center justify-center m-0">Ratings &amp; Reviews</h2>
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-8">
          <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-0">
          
            {/* LEFT SIDE - Average Rating */}
            <div className="w-full lg:flex-1 flex flex-col justify-center items-center pb-4 lg:pb-0 lg:border-b-0 border-b border-border">
              <h3 className="font-heading font-bold text-[1.5rem] max-[1180px]:text-[1.6rem] max-[480px]:text-[1.35rem] text-text-accent m-0">{ratingCount > 0 ? getRatingLabel(rating) : "No Ratings"}</h3>
              <div className="flex justify-center items-center text-accent-yellow text-[1.5rem] max-[1180px]:text-[1.35rem] max-[480px]:text-[1.2rem] my-1">
                {"★".repeat(Math.round(rating))}
                {"☆".repeat(5 - Math.round(rating))}
              </div>
              <p className="text-text-secondary text-[0.72rem] max-[480px]:text-[0.65rem] mt-1 font-primary text-center m-0">{ratingCount} Ratings &amp; {review_count} Reviews</p>
            </div>

            <div className="hidden lg:block mx-3 w-px h-24 bg-border"></div>

            {/* MIDDLE SIDE - Breakdown */}
            <div className="w-full lg:flex-[1.75] flex flex-col justify-center items-center gap-[0.85rem] max-[1180px]:gap-[0.75rem] max-[480px]:gap-[0.65rem] pb-4 lg:pb-0 lg:border-b-0 border-b border-border">
              {['5', '4', '3','2', '1'].map((star) => {
                const count = ratingStats[star] || 0;
                const percentage =
                  maxRating > 0
                    ? (count / maxRating) * 100
                    : 0;

                return (
                  <div key={star} className="w-full flex items-center gap-4 max-[1180px]:gap-[0.8rem] max-[480px]:gap-[0.6rem]">
                    <span className="min-w-[38px] text-[0.86rem] max-[480px]:text-[0.74rem] font-semibold text-text-secondary font-primary">{star} ★</span>

                    <div className="flex-1 lg:w-48 h-3 max-[480px]:h-[10px] bg-primary-surface rounded-full overflow-hidden border border-primary/5">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>

                    <span className="min-w-[38px] text-[0.86rem] max-[480px]:text-[0.74rem] font-semibold text-text-secondary font-primary text-right">{count}</span>
                  </div>
                );
              })}
            </div>

            <div className="hidden lg:block mx-3 w-px h-24 bg-border"></div>

            {/* RIGHT SIDE - Avg-rating */}
            <div className="w-full lg:flex-1 grid grid-cols-4 lg:grid-cols-2 justify-center items-center gap-4 max-[480px]:gap-[0.4rem]">
              {[
                { key: 'behaviour', label: 'Behaviour', val: avgRatings.behaviour },
                { key: 'quality', label: 'Quality', val: avgRatings.quality },
                { key: 'value', label: 'Value', val: avgRatings.value },
                { key: 'overall', label: 'Overall', val: overall }
              ].map(({ key, label, val }) => (
                <div className="flex flex-col justify-center items-center gap-1.5" key={key}>
                  <div 
                    className="w-12 h-12 max-[480px]:w-[2.7rem] max-[480px]:h-[2.7rem] rounded-full flex items-center justify-center font-bold text-[0.72rem] max-[480px]:text-[0.6rem] relative" 
                    style={{ background: `conic-gradient(var(--color-primary, #0f5c3e) ${getPercent(val)}%, var(--color-primary-surface, #e8f5ee) 0)` }}
                  >
                    <div className="w-[2.35rem] h-[2.35rem] max-[480px]:w-[2.1rem] max-[480px]:h-[2.1rem] bg-surface rounded-full flex items-center justify-center text-text border border-primary/10">
                      {getPercent(val)}%
                    </div>
                  </div>
                  <span className="text-[0.82rem] max-[480px]:text-[0.7rem] font-semibold text-text-secondary text-center font-primary">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col justify-between overflow-hidden mt-6 bg-surface border border-border shadow-[0_4px_10px_rgba(15,92,63,0.226),0_1px_2px_rgba(0,0,0,0.11)] rounded-[1rem] max-[1180px]:rounded-[0.9rem] max-[480px]:rounded-[0.85rem] p-[1.4rem] max-[1180px]:p-[1.1rem] max-[480px]:p-[1rem] gap-6 flex-1">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex justify-center items-center">
            <h3 className="font-heading font-bold text-base sm:text-lg lg:text-[1.2rem] text-text-accent">Reviews</h3>
          </div>

          {!loading && !isFetchingMore && !validReviews.length ? (
            <div className="text-center text-text-secondary text-sm py-4">No Reviews Yet</div>
          ) : (
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[470px] pr-1" ref={listRef}>
              {validReviews.map((review) => (
                <div className="flex justify-between items-start pb-4 border-b border-border last:border-b-0 gap-3" key={review.id}>
                  <div className="flex gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-primary to-primary-light text-text-on-dark flex items-center justify-center font-bold text-base font-heading shrink-0">
                      {review.userName[0]}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <p className="text-sm sm:text-base font-bold text-text font-primary m-0">{review.userName}</p>
                      <p className="text-xs sm:text-[0.92rem] text-text-secondary leading-relaxed font-primary mt-1 m-0">{review.comment}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="text-xs sm:text-sm flex gap-0.5">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-[0.74rem] text-text-secondary">
                      {review.createdAt?.seconds
                        ? new Date(review.createdAt.seconds * 1000).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              ))}
              
              {(loading || isFetchingMore) && <p className="text-center text-sm text-text-secondary">Loading reviews...</p>}
              <div ref={sentinelRef} style={{ height: '2px' }} />
            </div>
          )}
        </div>

        <button
          className="w-full sm:w-auto self-center border border-primary bg-primary text-text-on-dark rounded-xl py-2.5 px-6 cursor-pointer text-sm sm:text-[0.92rem] font-semibold font-primary hover:bg-primary-surface hover:text-primary transition-all active:scale-95"
          onClick={() => setShowReviewModal(true)}
        >
          Share Your Review
        </button>
        <AddReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          listingName={"This Listing"}
          onSubmit={handleSubmitReview}
        />
      </div>
    </div>
  );
}

export default RatingSection;

export function AddReviewModal({ isOpen, onClose, onSubmit, listingName }) {
  const [factorRatings, setFactorRatings] = useState({
    behaviour: 0,
    quality: 0,
    value: 0
  });

  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalRef = useRef(null);

  const handleRating = (factor, value) => {
    setFactorRatings((prev) => ({
      ...prev,
      [factor]: value,
    }));
  };

  const renderStars = (factor) => {
    return [...Array(5)].map((_, i) => {
      const value = i + 1;

      return (
        <i
          key={value}
          className={`cursor-pointer transition-transform hover:scale-110 text-xl sm:text-2xl ${
            value <= factorRatings[factor]
              ? "fa-solid fa-star text-accent-yellow"
              : "fa-regular fa-star text-primary/30"
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

  // CLOSE MODAL WHEN CLICKING OUTSIDE
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/45 backdrop-blur-sm flex justify-center items-center z-[99999] p-4 animate-[fadeIn_0.2s_ease]"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-[520px] bg-surface border border-primary/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative flex flex-col gap-5 sm:gap-6 shadow-2xl font-primary" ref={modalRef}>
        <div className="flex justify-between items-center text-lg sm:text-xl font-bold text-text-accent font-heading">
          <h2>Rate {listingName}</h2>

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
          <div className="flex items-center gap-2">{renderStars("behaviour")}</div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm sm:text-base font-semibold text-text m-0">Service / Product Quality</p>
          <div className="flex items-center gap-2">{renderStars("quality")}</div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm sm:text-base font-semibold text-text m-0">Value for Money</p>
          <div className="flex items-center gap-2">{renderStars("value")}</div>
        </div>

        <textarea
          placeholder="Write your experience (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full min-h-[120px] sm:min-h-[140px] resize-none border border-border rounded-xl p-3.5 bg-background text-text text-sm sm:text-[0.95rem] leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
        />

        <button
          onClick={submitReview}
          disabled={!isFormValid || isSubmitting}
          className="w-full border-none bg-gradient-to-r from-primary to-primary-light text-text-on-dark p-3.5 rounded-xl text-base font-bold font-primary cursor-pointer hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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
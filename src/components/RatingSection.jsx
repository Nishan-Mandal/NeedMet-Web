import '../style/RatingSection.css'
import { useReviews } from '../hooks/useReviews.js';
import { submitListingReview } from '../services/firebase/firestore/reviewService.js';
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

    console.log(response);

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
  ['5', '4', '3','2', '1'].map((star) => {
    maxRating = Math.max(maxRating || 0, ratingStats[star] || 0);
  })

  const renderStars = (count) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <i
                key={i}
                className={`fa-solid fa-star ${i <= count ? 'active' : ''}`}
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


  const overall = ((avgRatings.behaviour) + (avgRatings.quality)+ (avgRatings.value)) / 3;
  const getPercent = (val) => Math.round(((val) / 5) * 100);

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
    <div className="rating-review-section">
      <div className="rating-section">
        <div className="rating-section-top">
          <h2>Ratings & Reviews</h2>
        </div>

        <div className="rating-body">
          <div className="rating-container">
          
            {/* LEFT SIDE - Average Rating */}
            <div className="rating-overview">
              <h1>{ratingCount > 0 ? getRatingLabel(rating) : "No Ratings"}</h1>
              <div className="stars">
                {"★".repeat(Math.round(rating))}
                {"☆".repeat(5 - Math.round(rating))}
              </div>
              <p>{ratingCount} Ratings & {review_count} Reviews</p>
            </div>

            <div className="rating-left-div"></div>

            {/* MIDDLE SIDE - Breakdown */}
            <div className="rating-breakdown">
              {['5', '4', '3','2', '1'].map((star) => {
                const count = ratingStats[star] || 0;
                const percentage =
                  maxRating > 0
                    ? (count / maxRating) * 100
                    : 0;

                return (
                  <div key={star} className="rating-row">
                    <span>{star} ★</span>

                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>

                    <span>{count}</span>
                  </div>
                );
              })}
            </div>

            <div className="rating-right-div"></div>

            {/* RIGHT SIDE - Avg-rating */}
            <div className="avg-service-rating">
              <div className="avg-rating-container" key='behaviour'>
                <div 
                  className="avg-rating-circle" 
                  style={{ "--percent": `${getPercent(avgRatings.behaviour)}` }}
                >
                  <div className="avg-rating-circle-val">
                    {getPercent(avgRatings.behaviour)}%
                  </div>
                </div>
                <span>Behaviour</span>
              </div>
              <div className="avg-rating-container" key='quality'>
                <div 
                  className="avg-rating-circle" 
                  style={{ "--percent": `${getPercent(avgRatings.quality)}` }}
                >
                  <div className="avg-rating-circle-val">
                    {getPercent(avgRatings.quality)}%
                  </div>
                </div>
                <span>Quality</span>
              </div>
              <div className="avg-rating-container" key='value'>
                <div 
                  className="avg-rating-circle" 
                  style={{ "--percent": `${getPercent(avgRatings.value)}` }}
                >
                  <div className="avg-rating-circle-val">
                    {getPercent(avgRatings.value)}%
                  </div>
                </div>
                <span>Value</span>
              </div>
              <div className="avg-rating-container" key='overall'>
                <div 
                  className="avg-rating-circle" 
                  style={{ "--percent": `${getPercent(overall)}` }}
                >
                  <div className="avg-rating-circle-val">
                    {getPercent(overall)}%
                  </div>
                </div>
                <span>Overall</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="reviews-container">
            <div className="reviews-header">
                <h3>Reviews</h3>
            </div>

            {
              <>
                {
                  !loading && !isFetchingMore && !validReviews.length ? (
                    <div className="empty-review-text">No Reviews Yet</div>
                  ) : (
                    <div className="reviews-list" ref={listRef}>
                      {
                        validReviews.map((review) => (
                          <div className="review-card" key={review.id}>
                            <div className="review-card-left">
                              <div className="review-avatar">
                                {review.userName[0]}
                              </div>

                              <div className="review-user-info">
                                <p className="review-username">{review.userName}</p>
                                <p className="review-text">{review.comment}</p>
                              </div>
                            </div>

                            <div className="review-date">
                              <div className="review-stars">
                                {renderStars(review.rating)}
                              </div>

                              <span className="review-date">
                                {
                                  review.createdAt?.seconds
                                    ? new Date(review.createdAt.seconds * 1000).toLocaleDateString()
                                    : "N/A"
                                }
                              </span>
                            </div>
                          </div>
                        ))
                      }

                      
                      {(loading || isFetchingMore) && <p style={{'textAlign': 'center'}}>Loading reviews...</p>}
                      <div ref={sentinelRef} style={{ height: '2px' }} />
                    </div>
                  )
                }
              </>
            }

            <button
              className="share-your-review-btn"
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
          className={`fa-star ${
            value <= factorRatings[factor]
              ? "fa-solid active"
              : "fa-regular"
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
      className="review-modal-overlay"
      onClick={handleOverlayClick}
    >
      <div className="review-modal" ref={modalRef}>
        <div className="review-modal-header">
          <h2>Rate {listingName}</h2>

          <button
            onClick={onClose}
            className='review-modal-close'
          >
            <i className="fa-regular fa-circle-xmark"></i>
          </button>
        </div>

        <div className="rating-factor">
          <p>Owner's Behaviour</p>
          <div>{renderStars("behaviour")}</div>
        </div>

        <div className="rating-factor">
          <p>Service / Product Quality</p>
          <div>{renderStars("quality")}</div>
        </div>

        <div className="rating-factor">
          <p>Value for Money</p>
          <div>{renderStars("value")}</div>
        </div>

        <textarea
          placeholder="Write your experience (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          onClick={submitReview}
          disabled={!isFormValid || isSubmitting}
          className="submit-review-btn"
        >
          {
            isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                {" "}Submitting...
              </>
            ) : (
              "Submit Review"
            )
          }
        </button>
      </div>
    </div>
  );
}
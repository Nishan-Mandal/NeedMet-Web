import '../style/RatingSection.css'
import { useReviews } from '../hooks/useReviews.js';
import { useEffect, useRef } from 'react'

function RatingSection({ rating, review_count, ratingCount, ratingStats, avgRatings = {}, listingId }) {
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


  const overall = Math.round(((avgRatings.behaviour) + (avgRatings.quality)+ (avgRatings.value)) / 3)
  const getPercent = (val) => Math.round(((val) / 5) * 100);

  const { reviews, loading, hasMore, loadMore, isFetchingMore } = useReviews(listingId, 4);

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
                  !loading && !isFetchingMore && !reviews.length ? (
                    <div className="empty-review-text">No Reviews Yet</div>
                  ) : (
                    <div className="reviews-list" ref={listRef}>
                      {
                        reviews.map((review) => (
                          <div className="review-card" key={review.id}>
                            <div className="review-user">
                              <div className="review-avatar">
                                {review.userName[0]}
                              </div>

                              <div className="review-user-info">
                                <p className="review-username">{review.userName}</p>
                                <p className="review-text">{review.comment}</p>
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
                          </div>
                        ))
                      }

                      
                      {isFetchingMore && <p style={{'textAlign': 'center'}}>Loading more reviews...</p>}
                      <div ref={sentinelRef} style={{ height: '2px' }} />
                    </div>
                  )
                }
              </>
            }
            
        </div>
    </div>
    
  );
}

export default RatingSection;
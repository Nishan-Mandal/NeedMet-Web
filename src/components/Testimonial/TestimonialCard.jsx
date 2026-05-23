import React from "react";
import "../../style/Testimonial/TestimonialCard.css";

const StarRating = ({ rating }) => {
  return (
    <div
      className="testimonial-stars"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`testimonial-star ${
            star <= rating
              ? "testimonial-star--filled"
              : "testimonial-star--empty"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const TestimonialCard = ({
  name,
  role,
  location,
  quote,
  rating,
  initials,
}) => {
  return (
    <article className="testimonial-card">
      {/* <div className="testimonial-card-glow"></div> */}

      <StarRating rating={rating} />

      <blockquote className="testimonial-quote">
        &ldquo;{quote}&rdquo;
      </blockquote>

      <div className="testimonial-user">
        <div className="testimonial-avatar" aria-hidden="true">
          {initials}
        </div>

        <div className="testimonial-user-info">
          <h4 className="testimonial-user-name">{name}</h4>

          <p className="testimonial-user-role">
            {role}, {location}
          </p>
        </div>
      </div>
    </article>
  );
};

export default TestimonialCard;
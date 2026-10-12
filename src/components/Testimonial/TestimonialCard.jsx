import React from "react";

const StarRating = ({ rating }) => {
  return (
    <div
      className="testimonial-stars flex gap-1"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`testimonial-star leading-none text-[15px] sm:text-[17px] ${
            star <= rating
              ? "testimonial-star--filled text-[var(--accent-yellow)]"
              : "testimonial-star--empty text-[var(--border)]"
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
    <article className="testimonial-card relative flex flex-col justify-between overflow-hidden bg-[var(--surface)] border border-[rgba(15,92,62,0.1)] shadow-[0_4px_18px_rgba(0,0,0,0.04),0_10px_24px_rgba(15,92,62,0.06)] transition duration-300 ease-out hover:-translate-y-[5px] hover:shadow-[0_10px_24px_rgba(0,0,0,0.08),0_18px_36px_rgba(15,92,62,0.1)] w-[260px] h-[240px] flex-[0_0_260px] p-[20px_16px] rounded-[18px] sm:w-[300px] sm:h-[260px] sm:flex-[0_0_300px] sm:p-[24px_20px] sm:rounded-[22px] lg:w-[340px] lg:h-[275px] lg:flex-[0_0_340px] lg:p-[28px_24px] gap-3 sm:gap-4 lg:gap-[18px]">
      <StarRating rating={rating} />

      <blockquote className="testimonial-quote flex-1 m-0 overflow-hidden font-serif italic text-[var(--text)] text-[13px] leading-[1.6] sm:text-[14px] lg:text-[15px] lg:leading-[1.7]">
        &ldquo;{quote}&rdquo;
      </blockquote>

      <div className="testimonial-user flex items-center gap-2.5 sm:gap-3.5">
        <div 
          className="testimonial-avatar flex items-center justify-center rounded-full shrink-0 select-none font-primary font-bold text-[var(--text-on-dark)] bg-gradient-to-br from-[var(--primary-light)] to-[var(--primary)] w-10 h-10 text-[13px] sm:w-[42px] sm:h-[42px] sm:text-[14px] lg:w-[46px] lg:h-[46px] lg:text-[15px]" 
          aria-hidden="true"
        >
          {initials}
        </div>

        <div className="testimonial-user-info flex flex-col gap-0.5">
          <h4 className="testimonial-user-name m-0 font-primary font-bold text-[var(--text)] text-[14px] lg:text-[15px]">
            {name}
          </h4>

          <p className="testimonial-user-role m-0 font-primary text-[var(--text-secondary)] text-[12px] lg:text-[13px]">
            {role}, {location}
          </p>
        </div>
      </div>
    </article>
  );
};

export default TestimonialCard;
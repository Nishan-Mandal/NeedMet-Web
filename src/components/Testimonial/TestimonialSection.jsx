import React, { useEffect, useRef, useState } from "react";
import TestimonialCard from "./TestimonialCard";

import "../../style/Testimonial/TestimonialSection.css";

const testimonials = [
  {
    id: 1,
    name: "Rahul Kumar",
    role: "Student",
    location: "Haldia",
    initials: "RK",
    rating: 5,
    quote:
      "NeedMet helped me find a verified room rent in Haldia within hours. The listings were transparent, detailed, and completely free from hidden broker charges.",
  },

  {
    id: 2,
    name: "Priya Sharma",
    role: "Salon Owner",
    location: "Kolkata",
    initials: "PS",
    rating: 5,
    quote:
      "After listing my salon on NeedMet, I started getting new customer inquiries very quickly. It has become a great platform for growing my local business.",
  },

  {
    id: 3,
    name: "Amit Das",
    role: "Local Resident",
    location: "Haldia",
    initials: "AD",
    rating: 4,
    quote:
      "Finding reliable automobile services became much easier with NeedMet. Ratings, reviews, and contact details were all available in one convenient place.",
  },

  {
    id: 4,
    name: "Sneha Mondal",
    role: "Homemaker",
    location: "Durgapur",
    initials: "SM",
    rating: 5,
    quote:
      "I found an excellent tiffin service near my home through NeedMet. The reviews were accurate and the overall experience exceeded my expectations.",
  },

  {
    id: 5,
    name: "Debashis Roy",
    role: "Shop Owner",
    location: "Asansol",
    initials: "DR",
    rating: 5,
    quote:
      "Listing my electronics repair shop on NeedMet significantly improved my local visibility and helped bring many new customers to my business.",
  },

  {
    id: 6,
    name: "Taniya Ghosh",
    role: "Working Professional",
    location: "Kolkata",
    initials: "TG",
    rating: 4,
    quote:
      "NeedMet made relocating to Kolkata much easier. From PG accommodations to nearby food places, everything was available in one place.",
  },

  {
    id: 7,
    name: "Arjun Patel",
    role: "Freelancer",
    location: "Siliguri",
    initials: "AP",
    rating: 5,
    quote:
      "NeedMet is my preferred platform for finding trusted local services in Siliguri. The listings feel reliable and the interface is smooth and fast.",
  },
];

const loopTestimonials = [...testimonials, ...testimonials];

export default function TestimonialSection() {
  const sliderRef = useRef(null);

  const animationRef = useRef(null);

  const currentTranslate = useRef(0);

  const [pauseSlider, setPauseSlider] = useState(false);

  // CHANGE SPEED HERE
  const speed = 1.2;

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    const singleSetWidth = slider.scrollWidth / 2;

    const animate = () => {
      if (!pauseSlider) {
        currentTranslate.current += speed;

        if (currentTranslate.current >= singleSetWidth) {
          currentTranslate.current = 0;
        }

        slider.style.transform =
          `translate3d(-${currentTranslate.current}px, 0, 0)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [pauseSlider]);

  return (
    <section className="testimonial-section">
      <div className="testimonial-bg testimonial-bg-left"></div>

      <div className="testimonial-bg testimonial-bg-right"></div>

      <div className="testimonial-header">
        <span className="testimonial-subtitle">
          Real Stories
        </span>

        <h2 className="testimonial-title">
          Loved by Users <br />

          <span className="testimonial-title-highlight">
            Across India
          </span>
        </h2>
      </div>

      <div className="testimonial-slider-container">
        <div className="testimonial-fade testimonial-fade-left"></div>

        <div
          className="testimonial-slider-wrapper"
          onMouseEnter={() => setPauseSlider(true)}
          onMouseLeave={() => setPauseSlider(false)}
        >
          <div
            className="testimonial-slider-track"
            ref={sliderRef}
          >
            {loopTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`${testimonial.id}-${index}`}
                {...testimonial}
              />
            ))}
          </div>
        </div>

        <div className="testimonial-fade testimonial-fade-right"></div>
      </div>
    </section>
  );
}
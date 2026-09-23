import React, { useEffect, useRef, useState } from "react";
import TestimonialCard from "../../../components/Testimonial/TestimonialCard.jsx";

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
    <section className="relative isolate overflow-hidden font-primary bg-primary-surface py-[30px] sm:py-[35px] lg:py-[45px]">
      <div
        className="absolute rounded-full blur-[90px] opacity-45 pointer-events-none -top-[120px] -left-[100px] w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] lg:w-[460px] lg:h-[460px]"
        style={{ background: 'radial-gradient(circle, rgba(34, 196, 122, 0.28) 0%, transparent 70%)' }}
      />

      <div
        className="absolute rounded-full blur-[90px] opacity-45 pointer-events-none -bottom-[120px] -right-[80px] w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] lg:w-[360px] lg:h-[360px]"
        style={{ background: 'radial-gradient(circle, rgba(26, 138, 90, 0.22) 0%, transparent 70%)' }}
      />

      <div className="px-[18px] md:px-8 lg:px-[70px] mb-6 md:mb-[34px] lg:mb-[52px]">
        <span className="inline-block font-primary text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-primary-light mb-3 sm:mb-3.5">
          Real Stories
        </span>

        <h2 className="m-0 font-display font-bold text-text-accent tracking-[-0.03em] leading-[1.1] text-[34px] sm:text-[clamp(30px,5vw,44px)] lg:text-[clamp(36px,5vw,58px)]">
          Loved by Users <br />
          <span className="text-primary-light">
            Across India
          </span>
        </h2>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="absolute top-0 bottom-0 left-0 w-[40px] md:w-[70px] lg:w-[130px] z-[2] pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--primary-surface, #e8f5ee) 0%, transparent 100%)' }}
        />

        <div
          className="overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setPauseSlider(true)}
          onMouseLeave={() => setPauseSlider(false)}
        >
          <div
            className="flex items-stretch gap-4 sm:gap-5 lg:gap-6 w-max px-[18px] py-[10px] pb-[18px] sm:px-7 sm:py-[14px] sm:pb-6 lg:px-[42px] lg:py-[18px] lg:pb-7 [will-change:transform] [transform:translate3d(0,0,0)] [backface-visibility:hidden] [-webkit-font-smoothing:antialiased]"
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

        <div
          className="absolute top-0 bottom-0 right-0 w-[40px] md:w-[70px] lg:w-[130px] z-[2] pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--primary-surface, #e8f5ee) 0%, transparent 100%)' }}
        />
      </div>
    </section>
  );
}
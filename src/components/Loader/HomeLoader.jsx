import React from "react";
import "../../style/Loader/HomeLoader.css";

const SkeletonBox = ({ className }) => (
  <div className={`hl-skeleton ${className}`}></div>
);

const HomeLoader = () => {
  return (
    <div className="hl-container">

      {/* Hero Section */}
      <div className="hl-hero">
        
        {/* Left */}
        <div className="hl-hero-left">
          <SkeletonBox className="hl-text hl-small" />
          <SkeletonBox className="hl-search" />

          <div className="hl-tags">
            {Array(6).fill(0).map((_, i) => (
              <SkeletonBox key={i} className="hl-tag" />
            ))}
          </div>
        </div>

        {/* Right */}
        <SkeletonBox className="hl-hero-image" />
      </div>

      {/* Categories */}
      <div className="hl-section">
        <SkeletonBox className="hl-title" />

        <div className="hl-categories">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="hl-category-item">
              <SkeletonBox className="hl-icon" />
              <SkeletonBox className="hl-text hl-tiny" />
            </div>
          ))}
        </div>
      </div>

      {/* Newly Added */}
      <div className="hl-section">
        <SkeletonBox className="hl-title" />

        <div className="hl-cards">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="hl-card">
              <SkeletonBox className="hl-card-img" />
              <SkeletonBox className="hl-text hl-medium" />
              <SkeletonBox className="hl-text hl-small" />
            </div>
          ))}
        </div>
      </div>

      {/* Recommended */}
      <div className="hl-section">
        <SkeletonBox className="hl-title" />

        <div className="hl-cards">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="hl-card">
              <SkeletonBox className="hl-card-img" />
              <SkeletonBox className="hl-text hl-medium" />
              <SkeletonBox className="hl-text hl-small" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HomeLoader;
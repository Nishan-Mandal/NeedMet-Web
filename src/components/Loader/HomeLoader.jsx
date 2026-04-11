import React from "react";
import "../../style/Loader/HomeLoader.css";

const Box = ({ className }) => (
  <div className={`hl-loader ${className}`}></div>
);

const HomeLoader = () => {
  return (
    <div className="hl-container">

      {/* Hero Section */}
      <div className="hl-hero">

        {/* Left */}
        <div className="hl-hero-left">
          <Box className="hl-text-small" />
          <Box className="hl-search" />

          <div className="hl-tags">
            {Array(8).fill(0).map((_, i) => (
              <Box key={i} className="hl-tag" />
            ))}
          </div>
        </div>

        {/* Right */}
        <Box className="hl-hero-image" />
      </div>

      {/* Categories */}
      <div className="hl-section">
        <Box className="hl-title" />

        <div className="hl-categories">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="hl-category-item">
              <Box className="hl-icon" />
              <Box className="hl-text-tiny" />
            </div>
          ))}
        </div>
      </div>

      {/* Newly Added */}
      <div className="hl-section">
        <Box className="hl-title" />

        <div className="hl-cards">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="hl-card">
              <Box className="hl-card-img" />
              <Box className="hl-text-medium" />
              <Box className="hl-text-small" />
            </div>
          ))}
        </div>
      </div>

      {/* Recommended */}
      <div className="hl-section">
        <Box className="hl-title" />

        <div className="hl-cards">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="hl-card">
              <Box className="hl-card-img" />
              <Box className="hl-text-medium" />
              <Box className="hl-text-small" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HomeLoader;
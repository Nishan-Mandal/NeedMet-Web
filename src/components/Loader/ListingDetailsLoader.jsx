import React from "react";
import "../../style/Loader/ListingDetailsLoader.css";

function ListingDetailsLoader() {
  return (
    <div className="loader-detail-page">

      {/* TOP SECTION */}
      <div className="loader-detail-top">

        {/* LEFT - IMAGE */}
        <div className="loader-detail-left">
          <div className="loader-base loader-detail-main-img"></div>

          <div className="loader-detail-thumbnails">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="loader-base loader-detail-thumb"></div>
            ))}
          </div>
        </div>

        {/* RIGHT - INFO */}
        <div className="loader-detail-right">
          <div className="loader-base loader-detail-category"></div>
          <div className="loader-base loader-detail-title"></div>
          <div className="loader-base loader-detail-rating"></div>
          <div className="loader-base loader-detail-location"></div>

          <div className="loader-detail-socials">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="loader-base loader-detail-icon"></div>
            ))}
          </div>

          <div className="loader-base loader-detail-desc"></div>
          <div className="loader-base loader-detail-user"></div>
        </div>

      </div>

      {/* MIDDLE SECTION */}
      <div className="loader-detail-middle">

        {/* Ratings */}
        <div className="loader-detail-box">
          <div className="loader-base loader-detail-box-title"></div>
          <div className="loader-base loader-detail-rating-bars"></div>
        </div>

        {/* Opening Hours */}
        <div className="loader-detail-box">
          <div className="loader-base loader-detail-box-title"></div>
          <div className="loader-base loader-detail-table"></div>
        </div>

      </div>

      {/* REVIEWS */}
      <div className="loader-detail-box">
        <div className="loader-base loader-detail-box-title"></div>
        <div className="loader-base loader-detail-review"></div>
      </div>

      {/* SIMILAR LISTINGS */}
      <div className="loader-detail-section">
        <div className="loader-base loader-detail-section-title"></div>

        <div className="loader-detail-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="loader-detail-card">
              <div className="loader-base loader-detail-card-img"></div>
              <div className="loader-base loader-detail-card-name"></div>
              <div className="loader-base loader-detail-card-location"></div>
            </div>
          ))}
        </div>
      </div>

      {/* RECOMMENDED */}
      <div className="loader-detail-section">
        <div className="loader-base loader-detail-section-title"></div>

        <div className="loader-detail-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="loader-detail-card">
              <div className="loader-base loader-detail-card-img"></div>
              <div className="loader-base loader-detail-card-name"></div>
              <div className="loader-base loader-detail-card-location"></div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default ListingDetailsLoader;
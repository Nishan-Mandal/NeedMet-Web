import React from "react";
import "../../style/Loader/ListingSectionLoader.css";

function ListingSectionLoader({ count = 8, showSeeAll = true }) {
  return (
    <div className="listing-section-loader">

      {/* Header */}
      <div className={`loader-header ${!showSeeAll ? "no-see-all" : ""}`}>
        <div className="loader-skeleton loader-skeleton-title"></div>
        {showSeeAll && <div className="loader-skeleton loader-skeleton-see-all"></div>}
      </div>

      {/* Grid */}
      <div className="loader-grid">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="loader-card">

            <div className="loader-skeleton loader-skeleton-img"></div>

            <div className="loader-skeleton-content">
              <div className="loader-skeleton loader-skeleton-tag"></div>
              <div className="loader-skeleton loader-skeleton-name"></div>
              <div className="loader-skeleton loader-skeleton-location"></div>
              <div className="loader-skeleton loader-skeleton-rating"></div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default ListingSectionLoader;
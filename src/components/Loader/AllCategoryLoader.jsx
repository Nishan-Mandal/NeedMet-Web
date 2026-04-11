import React from "react";
import "../../style/Loader/AllCategoryLoader.css";

function AllCategoryLoader({ sections = 4, itemsPerSection = 8 }) {
  return (
    <div className="loader-category-page">

      {Array.from({ length: sections }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="loader-category-section">

          {/* Section Title */}
          <div className="loader-base loader-category-title"></div>

          {/* Items */}
          <div className="loader-category-grid">
            {Array.from({ length: itemsPerSection }).map((_, i) => (
              <div key={i} className="loader-category-item">

                {/* Icon */}
                <div className="loader-base loader-category-icon"></div>

                {/* Text */}
                <div className="loader-base loader-category-text"></div>

              </div>
            ))}
          </div>

        </div>
      ))}

    </div>
  );
}

export default AllCategoryLoader;
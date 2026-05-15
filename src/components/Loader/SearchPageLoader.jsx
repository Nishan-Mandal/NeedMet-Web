import "../../style/Loader/SearchPageLoader.css";

export default function SearchPageLoader() {
  return (
    <div className="search-page-skeleton-loader">

      {/* 🔹 Categories Loader */}
      <div className="search-skeleton-loader-section">

        <div className="
          search-skeleton-loader-title
          search-skeleton-loader-base
        "></div>

        <div className="search-skeleton-loader-category-grid">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="search-skeleton-loader-category-card"
            >

              <div className="
                search-skeleton-loader-category-icon
                search-skeleton-loader-base
              "></div>

              <div className="
                search-skeleton-loader-category-text
                search-skeleton-loader-base
              "></div>

            </div>
          ))}

        </div>

      </div>

      {/* 🔹 Listings Loader */}
      <div className="search-skeleton-loader-section">

        <div className="
          search-skeleton-loader-title
          search-skeleton-loader-base
        "></div>

        <div className="search-skeleton-loader-listing-grid">

          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="search-skeleton-loader-card"
            >

              <div className="
                search-skeleton-loader-image
                search-skeleton-loader-base
              "></div>

              <div className="search-skeleton-loader-content">

                <div className="
                  search-skeleton-loader-line
                  short
                  search-skeleton-loader-base
                "></div>

                <div className="
                  search-skeleton-loader-line
                  search-skeleton-loader-base
                "></div>

                <div className="
                  search-skeleton-loader-line
                  medium
                  search-skeleton-loader-base
                "></div>

                <div className="
                  search-skeleton-loader-line
                  small
                  search-skeleton-loader-base
                "></div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}
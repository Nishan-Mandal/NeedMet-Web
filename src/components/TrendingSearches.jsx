import "../style/TrendingSearches.css";
import { useNavigate } from "react-router-dom";

const DEFAULT_SEARCHES = [
  { id: 1, emoji: "🏠", label: "Room Rent", count: "2.4k" },
  { id: 2, emoji: "💈", label: "Salons", count: "1.8k" },
  { id: 3, emoji: "🍽️", label: "Restaurants", count: "3.1k" },
  { id: 4, emoji: "🚗", label: "Electronics & Mobile Shops", count: "940" },
  { id: 5, emoji: "💊", label: "Pharmacies", count: "1.2k" },
  { id: 6, emoji: "🏋️", label: "Fitness/Yoga Instructors", count: "780" },
  { id: 7, emoji: "👗", label: "Tailors & Laundry", count: "1.5k" },
  { id: 8, emoji: "🔧", label: "Mechanics & Vehicle Repair", count: "620" },
  { id: 9, emoji: "📚", label: "Tutors/Coaching Classes", count: "510" },
  { id: 10, emoji: "💧", label: "Water Supply & Bottled Water", count: "430" },
  { id: 11, emoji: "🛒", label: "Grocery & Supermarkets", count: "890" },
  { id: 12, emoji: "🎵", label: "Makeup Artists/Beauty Services", count: "290" },
];

export default function TrendingSearches({
  searches = DEFAULT_SEARCHES,
  style = {},
}) {

  const navigate = useNavigate();

  const navigateToSearch = (query) => {
    navigate(`/search?q=${query}`);
  };

  const infiniteSearches = [...searches, ...searches];

  return (
    <section className="trending-section" style={style}>

      <div className="trending-container">

        <div className="trending-header">

          <span className="trending-tag">
            What People Are Looking For
          </span>

          <h2 className="trending-title font-heading">
            Trending Searches
          </h2>

        </div>

        <div className="trending-scroll-wrapper">

          {/* Row 1 */}
          <div className="trending-scroll-track">

            {infiniteSearches.map((item, index) => (
              <button
                key={`${item.id}-${index}`}
                className="trending-pill"
                onClick={() => navigateToSearch(item.label)}
              >
                <span className="trending-pill-emoji">
                  {item.emoji}
                </span>

                <span className="trending-pill-label">
                  {item.label}
                </span>

                <span className="trending-pill-count">
                  {item.count}
                </span>
              </button>
            ))}

          </div>

          {/* Row 2 */}
          <div className="trending-scroll-track trending-scroll-track-reverse">

            {infiniteSearches.map((item, index) => (
              <button
                key={`reverse-${item.id}-${index}`}
                className="trending-pill"
                onClick={() => navigateToSearch(item.label)}
              >
                <span className="trending-pill-emoji">
                  {item.emoji}
                </span>

                <span className="trending-pill-label">
                  {item.label}
                </span>

                <span className="trending-pill-count">
                  {item.count}
                </span>
              </button>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}
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
    <section 
      className="trending-section pt-[50px] px-[35px] pb-0 max-[1024px]:pt-[35px] max-[1024px]:px-3 max-[576px]:pt-[30px] max-[576px]:px-1.5" 
      style={style}
    >
      <div className="trending-container bg-background-secondary overflow-hidden rounded-[20px] p-[28px_35px] max-[1024px]:rounded-2xl max-[1024px]:p-[22px_20px] max-[576px]:rounded-[14px] max-[576px]:p-[18px_12px_20px]">
        
        <div className="trending-header flex flex-col mb-5 gap-1.5 max-[576px]:mb-3.5 max-[576px]:gap-1">
          <span className="trending-tag font-primary text-[11px] font-bold tracking-[0.2em] uppercase text-text-accent mb-1.5">
            What People Are Looking For
          </span>

          <h2 className="trending-title font-heading font-bold text-text-accent tracking-[-0.02em] leading-[1.15] text-[clamp(1.5rem,3vw,2.2rem)] max-[1024px]:text-[1.4rem] max-[576px]:text-[1.2rem] m-0">
            Trending Searches
          </h2>
        </div>

        <div className="trending-scroll-wrapper group w-full overflow-hidden flex flex-col gap-2.5 max-[576px]:gap-2">
          {/* Row 1 */}
          <div className="trending-scroll-track flex items-center gap-2.5 max-[576px]:gap-2 w-max animate-[trendingInfiniteScroll_32s_linear_infinite] max-[1024px]:animate-[trendingInfiniteScroll_28s_linear_infinite] max-[576px]:animate-[trendingInfiniteScroll_22s_linear_infinite] group-hover:[animation-play-state:paused]">
            {infiniteSearches.map((item, index) => (
              <button
                key={`${item.id}-${index}`}
                className="trending-pill group/pill inline-flex items-center rounded-full font-primary shrink-0 whitespace-nowrap cursor-pointer border-[1.5px] border-border bg-surface transition duration-200 ease-out hover:border-primary-light hover:bg-primary-surface active:scale-[0.97] max-[576px]:active:opacity-80 gap-[7px] p-[9px_16px] max-[1024px]:p-[8px_14px] max-[576px]:gap-1.5 max-[576px]:p-[7px_12px]"
                onClick={() => navigateToSearch(item.label)}
              >
                <span className="trending-pill-emoji leading-none text-[15px] max-[576px]:text-[14px]">
                  {item.emoji}
                </span>

                <span className="trending-pill-label font-medium text-text whitespace-nowrap text-[13.5px] max-[1024px]:text-[13px] max-[576px]:text-[12px]">
                  {item.label}
                </span>

                <span className="trending-pill-count font-semibold rounded-full leading-[1.4] min-w-[32px] text-center bg-primary-surface text-text-accent transition-colors duration-200 group-hover/pill:bg-primary group-hover/pill:text-text-on-dark text-[11.5px] px-2 py-0.5 max-[576px]:text-[10px] max-[576px]:px-1.5">
                  {item.count}
                </span>
              </button>
            ))}
          </div>

          {/* Row 2 */}
          <div className="trending-scroll-track trending-scroll-track-reverse flex items-center gap-2.5 max-[576px]:gap-2 w-max animate-[trendingInfiniteScroll_32s_linear_infinite_reverse] max-[1024px]:animate-[trendingInfiniteScroll_28s_linear_infinite_reverse] max-[576px]:animate-[trendingInfiniteScroll_22s_linear_infinite_reverse] group-hover:[animation-play-state:paused]">
            {infiniteSearches.map((item, index) => (
              <button
                key={`reverse-${item.id}-${index}`}
                className="trending-pill group/pill inline-flex items-center rounded-full font-primary shrink-0 whitespace-nowrap cursor-pointer border-[1.5px] border-border bg-surface transition duration-200 ease-out hover:border-primary-light hover:bg-primary-surface active:scale-[0.97] max-[576px]:active:opacity-80 gap-[7px] p-[9px_16px] max-[1024px]:p-[8px_14px] max-[576px]:gap-1.5 max-[576px]:p-[7px_12px]"
                onClick={() => navigateToSearch(item.label)}
              >
                <span className="trending-pill-emoji leading-none text-[15px] max-[576px]:text-[14px]">
                  {item.emoji}
                </span>

                <span className="trending-pill-label font-medium text-text whitespace-nowrap text-[13.5px] max-[1024px]:text-[13px] max-[576px]:text-[12px]">
                  {item.label}
                </span>

                <span className="trending-pill-count font-semibold rounded-full leading-[1.4] min-w-[32px] text-center bg-primary-surface text-text-accent transition-colors duration-200 group-hover/pill:bg-primary group-hover/pill:text-text-on-dark text-[11.5px] px-2 py-0.5 max-[576px]:text-[10px] max-[576px]:px-1.5">
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

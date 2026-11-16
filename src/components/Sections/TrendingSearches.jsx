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
    <section className="w-full bg-transparent" style={style}>
      <div className="w-full overflow-hidden px-1 sm:px-2 py-4 sm:py-6 bg-transparent">
        <div className="flex flex-col mb-4 sm:mb-5 gap-1">
          <span className="font-primary text-[11px] font-bold tracking-[0.2em] uppercase text-emerald-700 mb-1">
            What People Are Looking For
          </span>

          <h2 className="font-heading font-bold text-[#0f5c3e] tracking-tight leading-[1.15] text-2xl sm:text-3xl lg:text-[2rem] m-0">
            Trending Searches
          </h2>
        </div>

        <div className="relative group w-full overflow-hidden flex flex-col gap-2 sm:gap-3 [mask-image:linear-gradient(to_right,transparent_0%,black_40px,black_calc(100%-40px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_40px,black_calc(100%-40px),transparent_100%)]">
          {/* Left Gradient Blur Mask */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-background via-background/70 to-transparent z-10 backdrop-blur-[2px]" />

          {/* Right Gradient Blur Mask */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-background via-background/70 to-transparent z-10 backdrop-blur-[2px]" />

          {/* Row 1 */}
          <div className="flex items-center gap-2 sm:gap-3 w-max animate-[trendingInfiniteScroll_32s_linear_infinite] group-hover:[animation-play-state:paused]">
            {infiniteSearches.map((item, index) => (
              <button
                key={`${item.id}-${index}`}
                type="button"
                onClick={() => navigateToSearch(item.label)}
                className="group/pill inline-flex items-center rounded-full font-primary shrink-0 whitespace-nowrap cursor-pointer border border-slate-200/90 bg-white hover:border-emerald-600 hover:bg-emerald-50/70 active:scale-[0.97] transition duration-200 ease-out gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 shadow-xs"
              >
                <span className="leading-none text-sm sm:text-base select-none">
                  {item.emoji}
                </span>

                <span className="font-medium text-slate-800 group-hover/pill:text-emerald-950 whitespace-nowrap text-xs sm:text-[13.5px]">
                  {item.label}
                </span>

                <span className="font-semibold rounded-full leading-tight min-w-[28px] text-center bg-emerald-100/70 text-emerald-800 transition-colors duration-200 group-hover/pill:bg-[#0f5c3e] group-hover/pill:text-white text-[10px] sm:text-[11.5px] px-2 py-0.5 ml-0.5">
                  {item.count}
                </span>
              </button>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex items-center gap-2 sm:gap-3 w-max [animation-direction:reverse] animate-[trendingInfiniteScroll_32s_linear_infinite] group-hover:[animation-play-state:paused]">
            {infiniteSearches.map((item, index) => (
              <button
                key={`reverse-${item.id}-${index}`}
                type="button"
                onClick={() => navigateToSearch(item.label)}
                className="group/pill inline-flex items-center rounded-full font-primary shrink-0 whitespace-nowrap cursor-pointer border border-slate-200/90 bg-white hover:border-emerald-600 hover:bg-emerald-50/70 active:scale-[0.97] transition duration-200 ease-out gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 shadow-xs"
              >
                <span className="leading-none text-sm sm:text-base select-none">
                  {item.emoji}
                </span>

                <span className="font-medium text-slate-800 group-hover/pill:text-emerald-950 whitespace-nowrap text-xs sm:text-[13.5px]">
                  {item.label}
                </span>

                <span className="font-semibold rounded-full leading-tight min-w-[28px] text-center bg-emerald-100/70 text-emerald-800 transition-colors duration-200 group-hover/pill:bg-[#0f5c3e] group-hover/pill:text-white text-[10px] sm:text-[11.5px] px-2 py-0.5 ml-0.5">
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

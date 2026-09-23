import { Link } from "react-router-dom";
import empty_thumb from "../../assets/empty_thumb.png";
import { generateSlug } from "../../utils/slugify.js";

const CATEGORY_PALETTE = [
  { bg: "#f3edff", border: "#d8c7ff" },
  { bg: "#edf9f2", border: "#b8e5ca" },
  { bg: "#fff1f6", border: "#ffc6e0" },
  { bg: "#fff6e9", border: "#ffd7a3" },
  { bg: "#f0f7ff", border: "#c6dbff" },
  { bg: "#fffcec", border: "#ffe7a6" },
  { bg: "#e9fbfa", border: "#b5ece8" },
  { bg: "#f6f0ff", border: "#d8c6ff" },
  { bg: "#fff3f0", border: "#ffc9c0" },
  { bg: "#f2fff2", border: "#c7efc7" },
  { bg: "#eef4ff", border: "#c3d5ff" },
  { bg: "#fff5ef", border: "#ffd4bf" },
];

export default function CategorySection({ title, subTitle = "", fontSz, categories, data, style = {}, showSeeAll = true, see_all_navigate }) {

  const categoryList = categories || data?.categories || [];

  return (
    <section 
      className="category-section px-[18px] py-[30px] sm:px-8 sm:py-[35px] lg:px-[70px] lg:py-[50px]" 
      style={style}
    >
      <div>

        {/* Top header */}
        <div className="category-container-top flex flex-col mb-3.5 sm:mb-5">
          <span className="category-tag font-primary text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--text-accent)] mb-3">
            {subTitle}
          </span>
          <div className="category-title-section flex justify-between items-center">
            <h2 
              className="category-title m-0 font-heading font-bold text-[var(--text-accent)] tracking-[-0.02em] leading-[1.15] text-[1.15rem] sm:text-[clamp(1.5rem,3vw,2.2rem)]" 
              style={fontSz ? { fontSize: fontSz } : undefined}
            >
              {title}
            </h2>
            {showSeeAll && see_all_navigate && (
              <Link 
                to={see_all_navigate} 
                className="see-all font-primary font-medium text-[#0f766e] hover:underline whitespace-nowrap text-[0.85rem] sm:text-base no-underline cursor-pointer"
              >
                See All ❯
              </Link>
            )}
          </div>
        </div>

        {categoryList.length === 0 ? (
          <p className="pl-8 font-primary text-slate-500">No categories available.</p>
        ) : (
          <div className="category-grid grid grid-cols-3 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] sm:gap-4 lg:grid-cols-[repeat(auto-fill,minmax(230px,1fr))]">
            {categoryList.map((category, index) => {
              const name  = category.name || category.category;
              const image = category.imageUrl || empty_thumb;
              const palette = CATEGORY_PALETTE[index % CATEGORY_PALETTE.length];
              const id = category.id || index;

              return (
                <Link
                  to={`/listings/category/${generateSlug(name)}`}
                  key={id}
                  style={{
                    backgroundColor: palette.bg,
                    borderColor: palette.border,
                    borderWidth: "1.5px",
                    borderStyle: "solid",
                  }}
                  className="category-card group flex max-sm:flex-col max-sm:justify-center max-sm:text-center items-center cursor-pointer transition-all duration-[250ms] ease-out box-border no-underline rounded-[15px] sm:rounded-[18px] gap-2 p-[14px_8px] min-h-[102px] sm:gap-3 sm:p-[15px_16px] sm:min-h-[74px] lg:gap-3.5 lg:p-[16px_18px] lg:min-h-[78px] sm:hover:-translate-y-[3px] active:scale-[0.97] active:opacity-85"
                >
                  <div className="category-icon flex items-center justify-center shrink-0 bg-white/75 rounded-[11px] w-[42px] h-[42px] sm:rounded-[14px] sm:w-12 sm:h-12 lg:w-[52px] lg:h-[52px]">
                    <img 
                      src={image} 
                      alt={name} 
                      loading="lazy" 
                      className="object-contain block w-6 h-6 sm:w-[30px] sm:h-[30px] lg:w-[34px] lg:h-[34px]" 
                    />
                  </div>
                  <p className="category-name font-primary font-medium text-[#222] break-words text-[12px] leading-[1.25] text-center line-clamp-2 sm:text-[14px] sm:leading-[1.3] sm:text-left sm:line-clamp-none lg:text-[15px]">
                    {name}
                  </p>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}


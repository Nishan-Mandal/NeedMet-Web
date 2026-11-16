import React from "react";
import { Link } from "react-router-dom";
import CategoryCard from "../CategoryCard.jsx";

export default function CategorySection({ title, subTitle = "", fontSz, categories, data, style = {}, showSeeAll = true, see_all_navigate }) {
  const categoryList = categories || data?.categories || [];

  return (
    <section 
      className="category-section px-[18px] py-[30px] sm:px-8 sm:py-[35px] lg:px-[70px] lg:py-[50px] bg-white" 
      style={style}
    >
      <div>
        {/* Top header */}
        <div className="category-container-top flex flex-col mb-4 sm:mb-6">
          {subTitle && (
            <span className="category-tag font-primary text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--text-accent)] mb-2.5">
              {subTitle}
            </span>
          )}
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
          <p className="pl-4 font-primary text-slate-500">No categories available.</p>
        ) : (
          <div className="category-grid grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-3 sm:gap-4 md:gap-5 max-w-5xl">
            {categoryList.map((category, index) => (
              <CategoryCard
                key={category.id || index}
                category={category}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


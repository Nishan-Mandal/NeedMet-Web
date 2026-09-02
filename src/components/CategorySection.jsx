import "../style/CategorySection.css";
import { Link } from "react-router-dom";
import empty_thumb from "../assets/empty_thumb.png";
import { generateSlug } from "../utils/slugify.js";

export default function CategorySection({ title, subTitle="", fontSz, categories, data, style = {}, showSeeAll = true, see_all_navigate}) {

  const categoryList = categories || data?.categories || [];

  return (
    <section className="category-section" style={style}>
      <div className="category-container">

        <div className="category-container-top">
          <span className="category-tag">{subTitle}</span>
          <div className="category-title-section">
            <h2 className="category-title" style={{fontSize: fontSz}}>{title}</h2>

            {showSeeAll && see_all_navigate && (
              <Link to={see_all_navigate} className="see-all">See All ❯</Link>
            )}
          </div>
        </div>

        {
          categoryList.length === 0 ? (
            <p style={{"paddingLeft": "2rem"}}>No categories available.</p>
          ) : (
            <div className="category-grid">
              {categoryList.map((category, index) => {
                
                const name = category.name || category.category;
                const image = category.imageUrl || empty_thumb;
                const id = category.id || index;

                return (
                  <Link
                    to={`/listings/category/${generateSlug(name)}`}
                    className="category-card"
                    key={id}
                  >
                    <div className="category-icon">
                      <img src={image} alt={name} loading="lazy" />
                    </div>
                    <p className="category-name">{name}</p>
                  </Link>
                );
              })}
            </div>
          )
        } 

      </div>
    </section>
  );
}
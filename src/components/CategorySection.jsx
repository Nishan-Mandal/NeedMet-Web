import "../style/CategorySection.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function CategorySection({ title, categories, data, style = {}, showSeeAll = true, see_all_navigate}) {

  const categoryList = categories || data?.categories || [];

  const navigate = useNavigate();

  const navigate_to_selected_category = (name) => {
    navigate(`/listings/category/${encodeURIComponent(name)}`);
  };


  return (
    <section className="category-section" style={style}>
      <div className="category-container">

        <div className="category-container-top">
          <h2 className="category-title">{title}</h2>

          {showSeeAll && see_all_navigate && (
            <Link to={see_all_navigate} className="see-all">See All ❯</Link>
          )}
        </div>

        <div className="category-grid">
          {categoryList.map((category, index) => {
            
            const name = category.name || category.category;
            const image = category.imageUrl;
            const id = category.id || index;

            return (
              <div className="category-card" key={id} onClick={() => navigate_to_selected_category(name)}>
                <div className="category-icon">
                  <img src={image} alt={name} />
                </div>
                <p className="category-name">{name}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
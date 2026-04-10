import "../style/CategorySection.css";

export default function CategorySection({ data }) {
  const categories = [
    "Room Rent",
    "PG",
    "Hostel",
    "Flat",
    "Room Rent",
    "PG",
    "Hostel",
    "Flat",
    "PG",
    "Hostel",
    "Flat"
  ];

  return (
    <section className="category-section">
      <div className="category-container">

        <div className="category-container-top">
          <h2 className="category-title">Categories</h2>
          <a className="see-all">See All ❯</a>
        </div>

        <div className="category-grid">
          {data.categories.map((category, index) => (
            <div className="category-card" key={index}>
              <div className="category-icon">
                <img src={category.imageUrl} alt="category" />
              </div>
              <p className="category-name">{category.category}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
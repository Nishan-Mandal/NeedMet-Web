import { useCategories } from "../hooks/useCategories";
import { CategorySection, AllCategoryLoader, SystemState } from "../components";
import { useMemo } from "react";
import ErrorImg from "../assets/error.png"
import NoDataImg from "../assets/no_data.png"

export default function AllCategory() {

  const { categories, loading, error } = useCategories();

  const groupedCategories = useMemo(() => {
    return categories.reduce((acc, cat) => {
      if (!acc[cat.section]) {
        acc[cat.section] = [];
      }
      acc[cat.section].push(cat);
      return acc;
    }, {});
  }, [categories]);

  
  if (loading) 
    return <AllCategoryLoader />;
  
  if (error)
    return (
      <SystemState
        imageSrc={ErrorImg}
        title="OOPS! Something Went"
        highlight="Wrong"
        message="We couldn't load the content right now. Please check your connection and try again later."
        actionType="refresh"
        actionLabel="Try Again"
      />
    );
    
    if(categories.length === 0) {
      return (
        <SystemState 
          imageSrc={NoDataImg}
          title="No Categories"
          highlight="Found"
          message="Currently, there are no categories available. Be the first to contribute by adding a new store or service!"
          actionType="navigate"
          actionLabel="+ Contribute Now"
          actionTo=""
        />
      );
    }
    
  return (
    <div>
      {Object.entries(groupedCategories).map(([section, items]) => (
        <CategorySection
          key={section}
          title={section}
          categories={items}
          style={{ textAlign: "center" }}
          showSeeAll={false}
        />
      ))}
    </div>
  );
}
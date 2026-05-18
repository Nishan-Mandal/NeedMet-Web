import { CategorySection, AllCategoryLoader, SystemState } from "../components";
import { useMemo } from "react";
import ErrorImg from "../assets/error.png"
import NoDataImg from "../assets/no_data.png"
import { useQuery } from "@tanstack/react-query";
import { getAllCategory } from "../services/firebase/firestore/categoryService.js";

export default function AllCategory() {

  // const { categories, loading, error } = useCategories();
  const { data: categories = [], isLoading: loading, error } = useQuery({
    queryKey: ['allCategories'],
    queryFn: () => getAllCategory(),
    onSuccess: (data) => console.log(data),
    onError: (error) => console.log(error)
  });

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
          actionType="redirect"
          actionLabel="+ Contribute Now"
          actionTo="https://play.google.com/store/apps/details?id=com.findon.app"
        />
      );
    }
    
  return (
    <div>
      <h1 style={{
        textAlign: 'center', 
        margin: '1rem 0 1rem', 
        fontFamily: 'var(--font-heading)', 
        color: 'var(--text-accent)', 
        fontSize: '1.6rem'
      }}>All Categories</h1>
      {Object.entries(groupedCategories).map(([section, items], index) => (
        <CategorySection
          key={section}
          title={section}
          fontSz="1.1rem"
          categories={items}
          style={{
            backgroundColor:
              index % 2 === 0
              ? "var(--background-secondary)"
              : "var(--background)"
          }}
          showSeeAll={false}
        />
      ))}
    </div>
  );
}
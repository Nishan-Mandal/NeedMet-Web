import { Hero, CategorySection, ListingSection, HomeLoader, SystemState } from '../components'
import ErrorImg from "../assets/error.png"
import { getNewListings, getRecommendedListings, getListingByCategory } from '../services/firebase/firestore/listingService.js';
import { useQuery, useQueries } from '@tanstack/react-query';
import { getHomeDetails } from '../services/firebase/firestore/homeService.js';

function Home() {

  const { data: homeData, isLoading: homeLoading, error: homeError } = useQuery({
    queryKey: ['homeDetails'],
    queryFn: () => getHomeDetails(),
  });

  const categoryList = homeData?.listings ?? [];

  const { data: recommendedListings = [] } = useQuery({
    queryKey: ['recommendedListings'],
    queryFn: () => getRecommendedListings({ quantity: 20 }),
  });

  const { data: newListings = [] } = useQuery({
    queryKey: ['newListings'],
    queryFn: () => getNewListings({ quantity: 20 }),
  });

  const categoryQueries = useQueries({
    queries: categoryList.map((category) => ({
      queryKey: ['categoryListings', category],
      queryFn: () => getListingByCategory({ category: [category], quantity: 20 }),
      enabled: !!category,
    })),
  });

  if(homeLoading) 
    return <HomeLoader />;

  if(homeError) {
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
  }
  
  return (
    <>
      <Hero data={homeData} />
      <CategorySection title="Top Categories" data={homeData} showSeeAll={true} see_all_navigate="/all_categories" />
      <ListingSection title="Recommended For You" listings={recommendedListings} showSeeAll={recommendedListings?.length >= 20} see_all_navigate="/listings/recommended" />
      <ListingSection title="Newly Added" listings={newListings} showSeeAll={newListings?.length >= 20} see_all_navigate="/listings/newly_added" />

      {categoryList.map((category, index) => (
        <ListingSection
          key={category}
          title={category}
          listings={categoryQueries[index]?.data ?? []}
          showSeeAll={(categoryQueries[index]?.data?.length ?? 0) >= 20}
          see_all_navigate={`/listings/${encodeURIComponent(category)}`}
        />
      ))}
    </>
  );
}

export default Home;
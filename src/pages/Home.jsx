import { Hero, CategorySection, ListingSection, HomeLoader, SystemState, TestimonialSection } from '../components'
import ErrorImg from "../assets/error.png"
import { getNewListings, getRecommendedListings, getListingByCategory } from '../services/firebase/firestore/listingService.js';
import { useQuery, useQueries } from '@tanstack/react-query';
import { getHomeDetails } from '../services/firebase/firestore/homeService.js';
import { useEffect } from 'react';
import useInfo from '../contexts/infoContext.jsx';

function Home() {

  const { data: homeData, isLoading: homeLoading, error: homeError } = useQuery({
    queryKey: ['homeDetails'],
    queryFn: () => getHomeDetails(),
  });
  
  const { setContactNo } = useInfo();
  useEffect(() => {
    if (homeData?.whatsappSupport) {
      setContactNo(homeData.whatsappSupport);
    }
  }, [homeData]);

  const categoryList = homeData?.listings ?? [];

  const { data: recommendedListings = [] } = useQuery({
    queryKey: ['recommendedListings', 'short'],
    queryFn: () => getRecommendedListings({ quantity: 20 }),
  });

  const { data: newListings = [] } = useQuery({
    queryKey: ['newListings', 'short'],
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
      <CategorySection title="Top Categories" data={homeData} see_all_navigate="/all_categories" />
      {
        recommendedListings.length > 0
          ? <ListingSection title="Recommended For You" listings={recommendedListings} see_all_navigate="/listings/recommended" />
          : null
      }
      {
        newListings.length > 0
          ? <ListingSection title="Newly Added" listings={newListings} see_all_navigate="/listings/newly_added" />
          : null
      }

      {categoryList.map((category, index) => {
        const listings = categoryQueries[index]?.data ?? [];

        if (!listings || listings.length === 0) return null;

        return (
          <ListingSection
            key={category}
            title={category}
            listings={listings}
            see_all_navigate={`/listings/category/${encodeURIComponent(category)}`}
          />
        );
      })}

      <TestimonialSection />
    </>
  );
}

export default Home;
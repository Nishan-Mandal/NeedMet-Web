import { Hero, CategorySection, ListingSection, HomeLoader, SystemState, TestimonialSection, Hyperlocal, TrendingSearches, BusinessCTA, Banner } from '../components'
import ErrorImg from "../assets/error.png"
import { getNewListings, getRecommendedListings, getListingByCategory } from '../services/firebase/firestore/listingService.js';
import { useQuery, useQueries } from '@tanstack/react-query';
import { getHomeDetails } from '../services/firebase/firestore/homeService.js';
import { useEffect, Fragment } from 'react';
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

  const sectionBgColors = [
    '#f7faf8', // light gray
    'white',   // white
  ];
  
  return (
    <>
      <Hero data={homeData} />
      <TrendingSearches />
      <CategorySection title="Browse By Categories" subTitle='DISCOVER LOCAL SERVICES' data={homeData} see_all_navigate="/all_categories" />
      {
        recommendedListings.length > 0
          ? <ListingSection title="Recommended For You"  subTitle={"Handpicked For You"} listings={recommendedListings} see_all_navigate="/listings/recommended" bgColor={'#f7faf8'}/>
          : null
      }

      <Hyperlocal />

      {
        newListings.length > 0
          ? <ListingSection title="Newly Added" subTitle={"Fresh on NeedMet"}listings={newListings} see_all_navigate="/listings/newly_added" />
          : null
      }

      <Banner imageUrl={homeData?.banners?.[0]?.imageUrl}/>

      {categoryList.map((category, index) => {
        const listings = categoryQueries[index]?.data ?? [];

        if (!listings || listings.length === 0) return null;

        const bannerIndex = (index+1) % homeData?.banners?.length;

        return (
          <Fragment key={category}>
            <ListingSection
              title={category}
              subTitle='Specially For You'
              listings={listings}
              see_all_navigate={`/listings/category/${encodeURIComponent(category)}`}
              bgColor={sectionBgColors[index % sectionBgColors.length]}
            />

            <Banner
              imageUrl={homeData?.banners?.[bannerIndex]?.imageUrl}
            />

          </Fragment>
        );
      })}

      <TestimonialSection />
      <BusinessCTA />
    </>
  );
}

export default Home;
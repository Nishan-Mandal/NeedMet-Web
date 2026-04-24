import { Hero, CategorySection, ListingSection, HomeLoader, SystemState } from '../components'
import ErrorImg from "../assets/error.png"
import { useListings } from '../hooks/useListings.js';
import { useHomeDetails } from '../hooks/useHomeDetails.js';
import { getListingByCategory, getNewListings, getRecommendedListings } from '../services/firebase/firestore/listingService.js';

function Home() {

  const { homeData, loading: homeLoading, error: homeError } = useHomeDetails();

  const categoryList = homeData?.listings || [];

  const { 
    listings: recommendedListings, 
    loading: recommendedLoading, 
    error: recommendedError
  } = useListings(getRecommendedListings,{ quantity: 20 })

  const { 
    listings: newListings, 
    loading: newLoading, 
    error: newError
  } = useListings(getNewListings, {'quantity': 20})

  if (homeLoading) {
    return <HomeLoader />;
  }

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
      <Hero data={homeData}/>
      <CategorySection title='Categories' data={homeData} see_all_navigate='/all_categories'/>
      <ListingSection title="Recommended Listings" listings={recommendedListings} see_all_navigate='/listings/recommended'/>
      <ListingSection title="Newly Added Listings" listings={newListings} see_all_navigate='/listings/newly_added'/>
    </>
  )
}

export default Home;
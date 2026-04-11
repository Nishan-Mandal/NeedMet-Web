import { Hero, CategorySection, ListingSection, HomeLoader } from '../components'
// import { listing } from '../data/listing_dummy_data.js'
import { useListings } from '../hooks/useListings.js';
import { useHomeDetails } from '../hooks/useHomeDetails.js';
import { getListingByCategory, getNewListings } from '../services/firebase/firestore/listingService.js';

function Home() {

  const { homeData, loading: homeLoading, error: homeError } = useHomeDetails();
  // console.log(homeData)

  const categoryList = homeData?.listings || [];

  const { 
    listings: homeListings, 
    loading: homeListingsLoading, 
    error: homeListingsError
  } = useListings(getListingByCategory,{ category: categoryList, quantity: 20 },categoryList.length > 0)

  const { 
    listings: newListings, 
    loading: newLoading, 
    error: newError
  } = useListings(getNewListings, {'quantity': 20})

  if (homeLoading) {
    return <HomeLoader />;
  }

  if(homeError || newError || homeListingsError) {
    return <p>Something went wrong, Come back later...</p>
  }

  return (
    <>
      <Hero data={homeData}/>
      <CategorySection title='Categories' data={homeData} see_all_navigate='/all_categories'/>
      <ListingSection title="Recommended Listings" listings={homeListings} see_all_navigate='/listings/recommended'/>
      <ListingSection title="Newly Added Listings" listings={newListings} see_all_navigate='/listings/newly_added'/>
    </>
  )
}

export default Home;
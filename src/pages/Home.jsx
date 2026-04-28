import { Hero, CategorySection, ListingSection, HomeLoader, SystemState } from '../components'
import ErrorImg from "../assets/error.png"
import { getListingByCategory, getNewListings, getRecommendedListings } from '../services/firebase/firestore/listingService.js';
import { useQuery } from '@tanstack/react-query';
import { getHomeDetails } from '../services/firebase/firestore/homeService.js';


function Home() {

  const { data: homeData, isLoading: homeLoading, error: homeError } = useQuery({
    queryKey: ['homeDetails'],
    queryFn: () => getHomeDetails(),
    onSuccess: (data) => console.log(data),
    onError: (error) => console.log(error)
  });

  const categoryList = homeData?.listings || [];

  const { data: recommendedListings = [] } = useQuery({
    queryKey: ['recommendedListings', 'short'],
    queryFn: () => getRecommendedListings({ quantity: 20 }),
    onSuccess: (data) => console.log(data),
    onError: (error) => console.log(error)
    });

  const { data: newListings = [] } = useQuery({
    queryKey: ['newListings', 'short'],
    queryFn: () => getNewListings({ quantity: 20 }),
    onSuccess: (data) => console.log(data),
    onError: (error) => console.log(error)
  });

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
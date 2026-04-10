import { useParams } from "react-router-dom";
import { useListings } from "../hooks/useListings";
import { getNewListings, getListingByCategory } from "../services/firebase/firestore/listingService";
import { useLocation } from "react-router-dom";
import { ListingSection } from "../components";

const ListingsPage = () => {
  const { state } = useLocation();
  const { type } = useParams();

  let fetchFn;

  const title = state?.title;
  const data = state?.listings;
  let params = state?.params || {'quantity': 20};

  // console.log('params:', params)

  
  if (type === "recommended") {
    fetchFn = getListingByCategory;
    params = {
      category: ["Printing & Xerox Shops", "Gas/LPG Cylinder", "Room Rent"],
      ...params,
    };
  } 
  else if (type === "newly_added") {
    fetchFn = getNewListings;
    params = {
      ...params,
    };
  } 
  else if (type === "similar") {
    fetchFn = getListingByCategory;
    params = {
      category: ["some dynamic category"],
      ...params,
    };
  }
  
  // console.log(params)
  const { listings: fetchedListings, loading, error } = useListings(fetchFn, params, !data);

  const listings = data || fetchedListings;

  if (loading) {
    return <p>Loading listings...</p>;
  }

  if(error) {
    return <p>Something went wrong, Come back later...</p>
  }

  if(listings.length == 0) {
    return <p>No listings found</p>
  }

  return (
    <ListingSection title={title} listings={listings} see_all_navigate='false'/>
  );
};

export default ListingsPage;
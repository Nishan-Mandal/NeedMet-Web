// import { ListingSection } from "../components/index.js"
// import { useListings } from "../hooks/useListings.js"
// import { getNewListings } from "../services/firebase/firestore/listingService.js"
// import { useLocation } from "react-router-dom"
// // import { listing } from '../data/listing_dummy_data.js'

// export default function NewlyAddedListings() {
//     const location = useLocation();
//     const stateListings = location.state?.listings;

//     const { listings: fetchedListings, loading, error} = useListings(getNewListings, {'quantity': 20}, !stateListings)

//     const listings = stateListings || fetchedListings;

//     if (loading) {
//         return <p>Loading listings...</p>;
//     }

//     if(error) {
//         return <p>Something went wrong, Come back later...</p>
//     }

//     return (
//         <>
//             <ListingSection title='Newly Added Listings' listings={listings} see_all_navigate='false'/>
//         </>
//     )
// }
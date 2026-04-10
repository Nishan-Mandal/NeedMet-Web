// import { ListingSection } from "../components"
// // import { listing } from '../data/listing_dummy_data.js'
// import { useListings } from "../hooks/useListings";
// import { getNewListings } from "../services/firebase/firestore/listingService";

// export default function RecommendedListings() {
//     const { listings, loading, error} = useListings(getNewListings, {'quantity': 20})
    
    
//     if (loading) {
//         return <p>Loading listings...</p>;
//     }

//     if(error) {
//         return <p>Something went wrong, Come back later...</p>
//     }

//     return (
//         <>
//             <ListingSection title='Recommended Listings' listings={listings} see_all_navigate='false'/>
//         </>
//     )
// }
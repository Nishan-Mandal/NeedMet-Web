import { getNewListings } from "../services/firebase/firestore/listingService.js";
import "../style/ListingSection.css";
import { ListingCard } from "./index.js";
import { Link, useLocation } from "react-router-dom";
import NoDataImg from "../assets/no_data.png"
import { SystemState, InlineNoListingsFound } from "./index.js";


function HeaderWithSeeAll({title, listings, see_all_navigate}) {
  return (
    <div className="listing-header">
      <h2>{title}</h2>
      <Link 
        to={see_all_navigate} 
        state={{ 
          title,
          listings,
          type: see_all_navigate, 
          params: { quantity: 20 } 
        }} 
        className="see-all"
      >
        See All ❯
      </Link>
    </div>
  )
}

function HeaderWithOutSeeAll({title}) {
  return (
    <div className="listing-header-without-see-all">
      <h2>{title}</h2>
    </div>
  )
}

export default function ListingSection({ title, listings=[], see_all_navigate }) {
  const location = useLocation();
  const isListingPage = location.pathname.includes('/listings');

  return (
    <section className="listing-section">
      
      {/* Header */}
      {
        see_all_navigate === 'false' || listings.length === 0 ? 
          <HeaderWithOutSeeAll title={title}/> : 
          <HeaderWithSeeAll title={title} listings={listings} see_all_navigate={see_all_navigate}/>
      }

      {/* Cards Grid */}
      {
        listings.length === 0 ?
          (
            isListingPage ? 
              <SystemState
                imageSrc={NoDataImg}
                title="No Listings"
                highlight="Found"
                message="Be the first to contribute by adding a store or service related to this category!"
                actionType="navigate"
                actionLabel="+ Contribute Now"
                actionTo=""
              /> : 
              <InlineNoListingsFound />
          ) :
          <div className="listing-grid">
            {listings.map((listing) => (
              <ListingCard key={listing.listingId} listing={listing} />
            ))}
          </div>
      }

    </section>
  );
}
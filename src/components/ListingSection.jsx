import { getNewListings } from "../services/firebase/firestore/listingService.js";
import "../style/ListingSection.css";
import { ListingCard } from "./index.js";
import { Link } from "react-router-dom";


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
  return (
    <section className="listing-section">
      
      {/* Header */}
      {
        see_all_navigate === 'false' ? 
          <HeaderWithOutSeeAll title={title}/> : 
          <HeaderWithSeeAll title={title} listings={listings} see_all_navigate={see_all_navigate}/>
      }

      {/* Cards Grid */}
      <div className="listing-grid">
        {listings.map((listing) => (
          <ListingCard key={listing.listingId} listing={listing} />
        ))}
      </div>

    </section>
  );
}
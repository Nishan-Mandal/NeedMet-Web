import "../style/ListingCard.css";
import { Link } from "react-router-dom";
import empty_thumb from "../assets/empty_thumb.png"
import premiumImg from "../assets/premium.png";


import { generateSlug } from "../utils/slugify.js";

export default function ListingCard({listing}) {

  const imageUrl = listing.images.length > 0 ? listing.images[0].thumbUrl : empty_thumb;

  return (
    <Link
      to={`/listing/${listing.listingId}/${generateSlug(listing.name)}`}
      state={{ listing }}
      className="listing-card"
    >
      {/* Image */}
      <div 
        className="listing-image" 
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}>
        {listing?.isPremium && (
            <div className="premium-badge">
              <img src={premiumImg} alt="premium" loading="lazy" /> 
              <span>Premium</span>
            </div>
          )}
      </div>

      {/* Content */}
      <div className="listing-content">
        <p className="listing-category">{listing.category}</p>

        <h3 className="listing-title">{listing.name}</h3>

        <div className="listing-location">
          <i className="fa-solid fa-location-dot loc-icon"></i>
          <span>{listing.address}</span>
        </div>

        <div className="listing-card-rating">
          <i className="fa-solid fa-star star-icon"></i>
          <span>{listing.rating} ({listing.reviews} reviews)</span>
        </div>
      </div>
    </Link>
  );
}
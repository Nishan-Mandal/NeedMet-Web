import "../style/ListingCard.css";
import { useNavigate } from "react-router-dom";
import empty_thumb from "../assets/empty_thumb.png"


export default function ListingCard({listing}) {

  const navigate = useNavigate()
  const navigateToListingDetails = () => {
    navigate(`/listing/${listing.listingId}`, {
      state: { listing: listing }
    });
  }

  const imageUrl = listing.images.length > 0 ? listing.images[0].thumbUrl : empty_thumb;

  return (
    <div className="listing-card" onClick={navigateToListingDetails}>
      {/* Image */}
      <div className="listing-image">
        <img src={imageUrl} alt={listing.name} onError={(e) => (e.target.src = empty_thumb)}/>
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
    </div>
  );
}
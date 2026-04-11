import { ListingBasicInfo, InfoTable, ListingSection, RatingSection, PreviewImage, ListingDetailsLoader } from '../components'
// import { listing } from '../data/listing_dummy_data.js'
import { useParams, useLocation } from 'react-router-dom';
import { useListings } from '../hooks/useListings.js';
import { useListingById } from '../hooks/useListingById.js';
import '../style/ListingDetails.css'
import { getNewListings } from '../services/firebase/firestore/listingService.js';


function ListingDetails() {
  const location = useLocation();
  const stateListing = location.state?.listing;
  
  const { listingId } = useParams();

  const { listing: fetchedListing, loading, error } = useListingById(listingId, !stateListing);

  const listing = stateListing || fetchedListing;
  // console.log(listing)
  const shouldFetch = !!listing;

  const { listings: newListings, loading: newLoading, error: newError} = useListings(
    getNewListings, 
    {'quantity':10}, 
    shouldFetch
  )
  const { listings: recommendedListings, loading: recommendedLoading, error: recommendedError} = useListings(
    getNewListings, 
    {'quantity':10}, 
    shouldFetch
  )

  if (error || newError || recommendedError) {
    return (
      <h2 style={{ textAlign: 'center', margin: '5rem 0' }}>
        Error loading listing
      </h2>
    );
  }

  if(loading) {
    return <ListingDetailsLoader />
  }

  if (!listing) {
    return (
      <h2 style={{ textAlign: 'center', margin: '5rem 0' }}>
        Listing Not Found
      </h2>
    );
  }

  const detailsRows = Object.entries(listing?.details || {}).map(
    ([details, info]) => [
      details, 
      info.toString()
    ]
  )

  const weekOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  const openingHoursRows = weekOrder.map((day) => {
    const details = listing?.businessHours?.[day];

    if (!details || details.isClosed) {
      return [day, "Closed"];
    }

    const slots = details?.slots;

    return [
      day,
      <div className="hours-cell">
        {slots.map((slot, index) => (
          <div key={index}>
            {slot.open} - {slot.close}
          </div>
        ))}
      </div>
    ];
  });

  const imageList = listing?.images?.map(image => image.fullUrl) || [];


  // Shared right-column content used in both desktop and mobile
  const rightContent = (
    <>
      <ListingBasicInfo listing={listing} />
      <InfoTable
        title='Opening Hours'
        columns={['Day', 'Hours']}
        rows={openingHoursRows}
        style={{ width: '100%' }}
      />
      <InfoTable
        title='Detailed Information'
        columns={["Details", "Info"]}
        rows={detailsRows}
        style={{ width: '100%' }}
        fixHeight={'280px'}
      />
    </>
  );

  return (
    <>
      <div className="listing-details">

        <div className="listing-details-left">
          <PreviewImage images={imageList} />

          <div className="likes-contact">
            <div className="likes">
              <div className="likes-count">
                <i className="fa-solid fa-thumbs-up"></i>
                {listing.likes}
              </div>
              <div className="views-count">({listing.views} Views)</div>
            </div>
            <div className="contact">
              <a 
                href={`tel:${listing?.phone || listing?.alternatePhone}`}
                className='call'
              >
                <i className="fa-solid fa-phone"></i>
                {listing?.phone || listing?.alternatePhone}
              </a>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${listing?.geo?.lat},${listing?.geo?.lng}`}  
                target="_blank"
                rel="noreferrer"
                className="direction"
              >
                <i className="fa-solid fa-location-arrow"></i>
                Direction
              </a>
            </div>
          </div>

          {/* Mobile-only: right content injected here in correct order */}
          <div className="listing-details-right-mobile">
            {rightContent}
          </div>

          <RatingSection
            rating={listing.rating}
            review_count={listing.reviews}
            ratingCount={listing.ratingCount}
            ratingStats={listing.ratingStats}
            avgRatings={listing.factorAvgRatings}
            listingId={listingId}
          />
        </div>

        {/* Desktop-only right column */}
        <div className="listing-details-right">
          {rightContent}
        </div>

      </div>

      <ListingSection title="Similar Listings" listings={newListings} see_all_navigate='/listings/similar' />
      <ListingSection title="Recommended Listings" listings={recommendedListings} see_all_navigate='/listings/recommended' />
    </>
  );
}

export default ListingDetails;
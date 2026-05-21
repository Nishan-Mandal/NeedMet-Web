import { 
  ListingBasicInfo, 
  InfoTable, 
  ListingSection, 
  RatingSection, 
  PreviewImage, 
  ListingDetailsLoader,
  SystemState,
  BusinessCTA,
  Hyperlocal
} from '../components'
import ErrorImg from "../assets/error.png"
import NoDataImg from "../assets/no_data.png"
import { useParams, useLocation } from 'react-router-dom';
import '../style/ListingDetails.css'
import { getNewListings, getListingByCategory, getListingById, getSimilarListings } from '../services/firebase/firestore/listingService.js';
import { useQuery } from '@tanstack/react-query';



function ListingDetails() {
  const location = useLocation();
  const stateListing = location.state?.listing;
  
  const { listingId } = useParams();

  const { data: fetchedListing, isLoading: loading, error } = useQuery({
    queryKey: ['listingById', listingId],
    queryFn: () => getListingById(listingId),
    initialData: stateListing,
    enabled: !!listingId,
    onSuccess: (data) => console.log(data),
    onError: (error) => console.log(error)
  });

  const listing = fetchedListing || stateListing;
  const shouldFetch = !!listing;

  const { data: newListings = [], isLoading: newLoading, error: newError } = useQuery({
    queryKey: ['newListings', 'short'],
    queryFn: () => getNewListings({ quantity: 20 }),
    enabled: shouldFetch, 
    onSuccess: (data) => console.log(data),
    onError: (error) => console.log(error)
  });

  const { data: similarListings = [], isLoading: similarLoading, error: similarError } = useQuery({
    queryKey: ['similarListings', 'short', listing?.category],
    queryFn: () => getSimilarListings({ category: listing?.category, listingId: listing?.listingId }),
    enabled: shouldFetch || !!listing?.category, 
    onSuccess: (data) => console.log(data),
    onError: (error) => console.log(error)
  });

  if (error) {
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

  if(loading) {
    return <ListingDetailsLoader />
  }

  if (!listing) {
    return (
      <SystemState
        imageSrc={NoDataImg}
        title="No Listing"
        highlight="Found"
        message="Be the first to contribute by adding a store or service related to this category!"
        actionType="redirect"
        actionLabel="+ Contribute Now"
        actionTo="https://play.google.com/store/apps/details?id=com.findon.app"
      />
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
            {slot}
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
        fixHeight={'250px'}
      />
    </>
  );

  return (
    <>
      <div className="listing-details">

        <div className="listing-details-left">
          <PreviewImage images={imageList} isPremium={listing?.isPremium} listing={listing} />

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

      {
        similarListings.length > 0
          ? <ListingSection title="Similar Listings" subTitle='YOU MAY ALSO LIKE' listings={similarListings} see_all_navigate={`/listings/similar/${listingId}`} />
          : null
      }

      <Hyperlocal />

      {
        newListings.length > 0
          ? <ListingSection title="Newly Added" subTitle='FRESH ON NEEDMET' listings={newListings} see_all_navigate='/listings/newly_added' bgColor={'var(--background-secondary)'} />
          : null
      }

      <BusinessCTA />
    </>
  );
}

export default ListingDetails;
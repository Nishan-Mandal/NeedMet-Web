import { 
  ListingBasicInfo, 
  InfoTable, 
  ListingSection, 
  RatingSection, 
  PreviewImage, 
  ListingDetailsLoader,
  SystemState,
  BusinessCTA,
  Hyperlocal, 
  Button,
  Loader
} from '../components'
import ErrorImg from "../assets/error.png"
import NoDataImg from "../assets/no_data.png"
import { useParams, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import '../style/ListingDetails.css'
import { getNewListings, getListingByCategory, getListingById, getSimilarListings } from '../services/firebase/firestore/listingService.js';
import { useQuery } from '@tanstack/react-query';
import { TimeSlot } from '../data/model/listingModel.js';
import { useState } from "react";
import { SubmitIcon, BackIcon } from '../assets/collection.jsx';
import { useListingDraft } from "../contexts/listingDraftContext";
import { buildListingPreviewFromFormData } from "../services/firebase/listing/listingPreviewBuilder.js";
import { createListingPipeline } from "../services/firebase/listing/listingPipeline.js";
import { useToast } from '../contexts/toastContext';


// used in -> 
// 1. from listing card
// 2. direct url hit
// 3. preview page


function ListingDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const [submittingPreview, setSubmittingPreview] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const { showToast } = useToast();

  const { draftFormData, clearDraftFormData } = useListingDraft();

  const isPreviewPage = location.pathname === "/contribute/listing/preview";
  
  const previewListing = isPreviewPage && draftFormData
    ? buildListingPreviewFromFormData({
        formData: draftFormData,
        listingId: "preview-listing",
      })
    : null;

  const stateListing = location.state?.listing;
  
  const [searchParams] = useSearchParams();
  const shouldOpenReviewModal = searchParams.get("show") === "review_modal";
  
  const { listingId } = useParams();

  const { data: fetchedListing, isLoading: loading, error } = useQuery({
    queryKey: ['listingById', listingId],
    queryFn: () => getListingById(listingId),
    initialData: stateListing,
    enabled: !isPreviewPage && !!listingId,
    onSuccess: (data) => console.log(data),
    onError: (error) => console.log(error)
  });

  const listing = isPreviewPage ? previewListing : fetchedListing || stateListing;
  const shouldFetch = !isPreviewPage && !!listing;

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
    enabled: shouldFetch && !!listing?.category, 
    onSuccess: (data) => console.log(data),
    onError: (error) => console.log(error)
  });

  if (isPreviewPage && !draftFormData) {
    return (
      <SystemState
        imageSrc={NoDataImg}
        title="No Preview"
        highlight="Data Found"
        message="Please fill the form first before opening preview."
        actionType="redirect"
        actionLabel="Go Back to Form"
        actionTo="/contribute/listing"
      />
    );
  }

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

  const handlePreviewSubmit = async () => {
    if (!draftFormData) return;

    try {
      setSubmittingPreview(true);
      setUploadProgress("Preparing listing...")

      const listingId = await createListingPipeline(
        draftFormData,
        (uploaded, total) => {
          setUploadProgress?.(`Uploading ${uploaded}/${total} images...`);
        }
      );

      if (!listingId) {
        console.error("Failed to create listing.");
        return;
      }

      setUploadProgress("Finalizing listing...")

      // this clears context + localStorage
      clearDraftFormData();

      showToast("Listing created successfully.", 'regular')
      navigate(`/listing/${listingId}`);
    } catch (error) {
      console.error("Error submitting listing from preview:", error);
    } finally {
      setSubmittingPreview(false);
      setUploadProgress("");
    }
  };

  const detailsRows = listing?.details
    ? (listing?.detailsOrder?.length
        ? listing.detailsOrder
            .filter((key) => key in listing.details)
            .map((key) => [key, String(listing.details[key])])
        : Object.entries(listing.details).map(([key, value]) => [key, String(value)]))
    : [];

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

    const slots = details?.slots || [];

    return [
      day,
      <div className="hours-cell">
        {slots.map((slot, index) => {
          const timeSlot = TimeSlot.fromJson(slot);

          return (
            <div key={index}>
              {timeSlot.to12Hour()}
            </div>
          );
        })}
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

              <Button
                href={`https://www.google.com/maps/dir/?api=1&destination=${listing?.geo?.lat},${listing?.geo?.lng}`}
                target="_blank"
                rel="noreferrer"
                variant="primary"
                icon={<i className="fa-solid fa-location-arrow"></i>}
              >
                Direction
              </Button>
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
            openReviewModal={shouldOpenReviewModal}
          />
        </div>

        {/* Desktop-only right column */}
        <div className="listing-details-right">
          {rightContent}
        </div>

      </div>

      {
        submittingPreview && 
        <Loader text={uploadProgress}/>
      }

      {
        listing.listingId === "preview-listing"
          ? (
            <div className='actionBar'>
              <Button type='button' variant='secondary' onClick={() => navigate(-1)}>
                <BackIcon size={14}/>
                Back To Edit
              </Button>
              
              <Button type='button' variant='primary'onClick={handlePreviewSubmit} disabled={submittingPreview}>
                <SubmitIcon size={14}/>
                Submit
              </Button>
            </div>
          )
          : (
            <>
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
          )
      }
    </>
  );
}

export default ListingDetails;
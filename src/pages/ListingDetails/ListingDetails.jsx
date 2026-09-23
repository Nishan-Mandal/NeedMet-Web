import { 
  ListingBasicInfo, 
  InfoTable, 
  RatingSection, 
  PreviewImage, 
} from './Sections';
import {
  ListingSection, 
  ListingDetailsLoader,
  SystemState,
  BusinessCTA,
  Hyperlocal, 
  Button,
  Loader,
  SEO
} from '../../components';
import { generateSlug } from "../../utils/slugify.js";
import ErrorImg from "../../assets/error.png";
import NoDataImg from "../../assets/no_data.png";
import { useParams, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { getNewListings, getListingByCategory, getListingById, getSimilarListings } from '../../services/firebase/firestore/listingService.js';
import { useQuery } from '@tanstack/react-query';
import { TimeSlot } from '../../data/model/listingModel.js';
import { useState } from "react";
import { SubmitIcon, BackIcon } from '../../assets/collection.jsx';
import { useListingDraft } from "../../contexts/listingDraftContext";
import { buildListingPreviewFromFormData } from "../../services/firebase/listing/listingPreviewBuilder.js";
import { createListingPipeline } from "../../services/firebase/listing/listingPipeline.js";
import { useToast } from '../../contexts/toastContext';


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
    
  });

  const listing = isPreviewPage ? previewListing : fetchedListing || stateListing;

  const cleanListingSlug = listing && listing.listingId !== "preview-listing" ? generateSlug(listing.name) : "";
  const canonicalUrl = listing && listing.listingId !== "preview-listing" 
    ? `https://needmet.in/listing/${listing.listingId}/${cleanListingSlug}` 
    : undefined;

  const schema = listing && listing.listingId !== "preview-listing" ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": listing.name,
    "description": listing.description || `Find ${listing.name} in ${listing.address} on NeedMet.`,
    "image": listing.images?.map(img => img.fullUrl) || [],
    "telephone": listing.phone || listing.alternatePhone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": listing.address,
      "addressLocality": listing.city || "Delhi",
      "addressCountry": "IN"
    },
    "geo": listing.geo ? {
      "@type": "GeoCoordinates",
      "latitude": listing.geo.lat,
      "longitude": listing.geo.lng
    } : undefined,
    "url": `https://needmet.in/listing/${listing.listingId}/${cleanListingSlug}`,
    "aggregateRating": listing.ratingCount > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": listing.rating,
      "reviewCount": listing.ratingCount
    } : undefined
  } : null;

  const shouldFetch = !isPreviewPage && !!listing;

  const { data: newListings = [], isLoading: newLoading, error: newError } = useQuery({
    queryKey: ['newListings', 'short'],
    queryFn: () => getNewListings({ quantity: 20 }),
    enabled: shouldFetch, 

  });

  const { data: similarListings = [], isLoading: similarLoading, error: similarError } = useQuery({
    queryKey: ['similarListings', 'short', listing?.category],
    queryFn: () => getSimilarListings({ category: listing?.category, listingId: listing?.listingId }),
    enabled: shouldFetch && !!listing?.category, 
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
      {listing && (
        <SEO 
          title={`${listing.name} in ${listing.address} - ${listing.category} | NeedMet`}
          description={`Find ${listing.name} (${listing.category}) in ${listing.address}. Get contact details, location directions, opening hours, and more on NeedMet.`}
          canonicalUrl={canonicalUrl}
          schema={schema}
          image={listing.images?.[0]?.fullUrl}
          ogType="article"
        />
      )}
      <div className="p-4 max-[478px]:p-3 max-[924px]:py-[35px] max-[924px]:px-8 min-[925px]:px-[70px] min-[925px]:py-[50px] flex flex-col min-[925px]:flex-row justify-center items-start gap-6 bg-background-secondary">

        <div className="w-full min-[925px]:flex-[1.2] flex flex-col gap-6 min-w-0">
          <PreviewImage images={imageList} isPremium={listing?.isPremium} listing={listing} />

          <div className="w-full flex flex-col min-[1025px]:flex-row justify-between items-center gap-4 min-[1025px]:gap-20 rounded-[1rem] bg-surface border border-border p-[0.9rem_1rem] max-[924px]:p-[0.85rem_0.9rem] max-[924px]:rounded-[0.9rem] shadow-[0_4px_10px_rgba(15,92,63,0.226),0_1px_2px_rgba(0,0,0,0.11)]">
            <div className="flex items-center justify-center gap-2 text-base font-semibold font-primary shrink-0 whitespace-nowrap text-text">
              <div className="flex items-center gap-1.5">
                <i className="fa-solid fa-thumbs-up text-primary"></i>
                {listing.likes}
              </div>
              <div className="text-text-secondary font-medium">({listing.views} Views)</div>
            </div>
            <div className="flex gap-3 w-full min-[1025px]:w-auto flex-1 min-w-0">
              <a 
                href={`tel:${listing?.phone || listing?.alternatePhone}`}
                className='flex-1 flex items-center justify-center gap-2 rounded-[0.9rem] max-[924px]:rounded-[0.8rem] font-semibold text-sm min-[925px]:text-[0.95rem] font-primary whitespace-nowrap cursor-pointer py-3 px-4 bg-gradient-to-br from-primary to-primary-light text-text-on-dark border border-border shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all'
              >
                <i className="fa-solid fa-phone animate-[ring_1.5s_infinite]"></i>
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
          <div className="min-[925px]:hidden flex flex-col gap-4 w-full">
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
        <div className="hidden min-[925px]:flex min-[925px]:flex-1 flex-col self-start sticky top-5 gap-6 min-w-0">
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
            <div className='sticky bottom-0 md:bottom-0 max-md:bottom-[66px] left-5 right-5 flex items-center justify-between gap-3 bg-white border border-[#e2e8f0] p-4 sm:px-6 sm:py-[18px] shadow-sm mb-5 z-20'>
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
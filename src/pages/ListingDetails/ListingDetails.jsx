import {
  HeroGallery,
  ActionBar,
  BusinessInfoCard,
  OpeningHoursCard,
  DetailInfoCard,
  RatingsV2,
} from './Sections';

import {
  ListingSection,
  ListingDetailsLoader,
  SystemState,
  BusinessCTA,
  Hyperlocal,
  Button,
  Loader,
  SEO,
} from '../../components';

import { generateSlug } from '../../utils/slugify.js';
import ErrorImg from '../../assets/error.png';
import NoDataImg from '../../assets/no_data.png';
import { useParams, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import {
  getNewListings,
  getListingById,
  getSimilarListings,
} from '../../services/firebase/firestore/listingService.js';
import { useQuery } from '@tanstack/react-query';
import { TimeSlot } from '../../data/model/listingModel.js';
import { useState } from 'react';
import { SubmitIcon, BackIcon } from '../../assets/collection.jsx';
import { useListingDraft } from '../../contexts/listingDraftContext';
import { buildListingPreviewFromFormData } from '../../services/firebase/listing/listingPreviewBuilder.js';
import { createListingPipeline } from '../../services/firebase/listing/listingPipeline.js';
import { useToast } from '../../contexts/toastContext';

function ListingDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const [submittingPreview, setSubmittingPreview] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const { showToast } = useToast();
  const { draftFormData, clearDraftFormData } = useListingDraft();

  const isPreviewPage = location.pathname === '/contribute/listing/preview';

  const previewListing = isPreviewPage && draftFormData
    ? buildListingPreviewFromFormData({ formData: draftFormData, listingId: 'preview-listing' })
    : null;

  const stateListing = location.state?.listing;

  const [searchParams] = useSearchParams();
  const shouldOpenReviewModal = searchParams.get('show') === 'review_modal';

  const { listingId } = useParams();

  const { data: fetchedListing, isLoading: loading, error } = useQuery({
    queryKey: ['listingById', listingId],
    queryFn: () => getListingById(listingId),
    initialData: stateListing,
    enabled: !isPreviewPage && !!listingId,
  });

  const listing = isPreviewPage ? previewListing : fetchedListing || stateListing;

  // ── SEO ─────────────────────────────────────────────────────
  const cleanListingSlug = listing && listing.listingId !== 'preview-listing' ? generateSlug(listing.name) : '';
  const canonicalUrl = listing && listing.listingId !== 'preview-listing'
    ? `https://needmet.in/listing/${listing.listingId}/${cleanListingSlug}`
    : undefined;

  const schema = listing && listing.listingId !== 'preview-listing' ? {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: listing.name,
    description: listing.description || `Find ${listing.name} in ${listing.address} on NeedMet.`,
    image: listing.images?.map(img => img.fullUrl) || [],
    telephone: listing.phone || listing.alternatePhone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address,
      addressLocality: listing.city || 'Delhi',
      addressCountry: 'IN',
    },
    geo: listing.geo ? { '@type': 'GeoCoordinates', latitude: listing.geo.lat, longitude: listing.geo.lng } : undefined,
    url: `https://needmet.in/listing/${listing.listingId}/${cleanListingSlug}`,
    aggregateRating: listing.ratingCount > 0
      ? { '@type': 'AggregateRating', ratingValue: listing.rating, reviewCount: listing.ratingCount }
      : undefined,
  } : null;

  // ── Related queries ──────────────────────────────────────────
  const shouldFetch = !isPreviewPage && !!listing;

  const { data: newListings = [] } = useQuery({
    queryKey: ['newListings', 'short'],
    queryFn: () => getNewListings({ quantity: 20 }),
    enabled: shouldFetch,
  });

  const { data: similarListings = [] } = useQuery({
    queryKey: ['similarListings', 'short', listing?.category],
    queryFn: () => getSimilarListings({ category: listing?.category, listingId: listing?.listingId }),
    enabled: shouldFetch && !!listing?.category,
  });

  // ── Guard states ─────────────────────────────────────────────
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

  if (loading) return <ListingDetailsLoader />;

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

  // ── Preview submit ───────────────────────────────────────────
  const handlePreviewSubmit = async () => {
    if (!draftFormData) return;
    try {
      setSubmittingPreview(true);
      setUploadProgress('Preparing listing...');
      const newListingId = await createListingPipeline(draftFormData, (uploaded, total) => {
        setUploadProgress(`Uploading ${uploaded}/${total} images...`);
      });
      if (!newListingId) { console.error('Failed to create listing.'); return; }
      setUploadProgress('Finalizing listing...');
      clearDraftFormData();
      showToast('Listing created successfully.', 'regular');
      navigate(`/listing/${newListingId}`);
    } catch (err) {
      console.error('Error submitting listing from preview:', err);
    } finally {
      setSubmittingPreview(false);
      setUploadProgress('');
    }
  };

  // ── Data preparation ─────────────────────────────────────────
  const detailsRows = listing?.details
    ? (listing?.detailsOrder?.length
        ? listing.detailsOrder
            .filter(key => key in listing.details)
            .map(key => [key, String(listing.details[key])])
        : Object.entries(listing.details).map(([key, value]) => [key, String(value)]))
    : [];

  const imageList = listing?.images?.map(image => image.fullUrl) || [];

  return (
    <>
      {/* SEO */}
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

      {/* ── Page wrapper ───────────────────────────────────── */}
      <div className="min-h-screen bg-[#f8faf9] font-primary">
        <div className="w-full px-3.5 sm:px-6 lg:px-[70px] py-3.5 sm:py-6 lg:py-8 max-w-7xl mx-auto">

          {/* ── Two-column Hero Section: Gallery on Left, Business Details on Right ── */}
          <div className="flex flex-col min-[925px]:grid min-[925px]:grid-cols-12 gap-3.5 sm:gap-5 lg:gap-6 items-start">

            {/* Left Column (col-span-7): Gallery (+ Mobile Contributor Action Bar directly beneath) */}
            <div className="w-full min-[925px]:col-span-7 min-w-0 flex flex-col gap-3">
              <HeroGallery
                images={imageList}
                isPremium={listing?.isPremium}
              />
              {/* On Mobile (<925px): Contributor Action Bar directly beneath main photo (YouTube pattern) */}
              <div className="min-[925px]:hidden">
                <ActionBar listing={listing} />
              </div>
            </div>

            {/* Right Column (col-span-5): Business Details */}
            <div className="w-full min-[925px]:col-span-5 min-w-0">
              <BusinessInfoCard listing={listing} />
            </div>
          </div>

          {/* ── Desktop (>=925px): Full-Width Contributor Action Bar Spanning Across the Screen ── */}
          <div className="hidden min-[925px]:block mt-4 lg:mt-5 w-full">
            <ActionBar listing={listing} />
          </div>

          {/* ── Full-width Detailed Information Section ── */}
          {detailsRows.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <DetailInfoCard title="Detailed Information" rows={detailsRows} />
            </div>
          )}

          {/* ── Full-width Opening Hours Section ── */}
          <div className="mt-6 sm:mt-8">
            <OpeningHoursCard businessHours={listing?.businessHours} />
          </div>

          {/* ── Full-width Ratings & Reviews Section ── */}
          <div className="mt-6 sm:mt-8">
            <RatingsV2
              rating={listing.rating}
              review_count={listing.reviews}
              ratingCount={listing.ratingCount}
              ratingStats={listing.ratingStats}
              avgRatings={listing.factorAvgRatings}
              listingId={listingId}
              openReviewModal={shouldOpenReviewModal}
            />
          </div>
        </div>
      </div>

      {/* Loading overlay for preview submit */}
      {submittingPreview && <Loader text={uploadProgress} />}

      {/* Preview mode footer bar */}
      {listing.listingId === 'preview-listing' ? (
        <div className="sticky bottom-0 left-0 right-0 flex items-center justify-between gap-3 bg-white border-t border-border p-4 sm:px-6 sm:py-[18px] shadow-sm z-20">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            <BackIcon size={14} />
            Back To Edit
          </Button>
          <Button type="button" variant="primary" onClick={handlePreviewSubmit} disabled={submittingPreview}>
            <SubmitIcon size={14} />
            Submit
          </Button>
        </div>
      ) : (
        <>
          {similarListings.length > 0 && (
            <ListingSection
              title="Similar Listings"
              subTitle="YOU MAY ALSO LIKE"
              listings={similarListings}
              see_all_navigate={`/listings/similar/${listingId}`}
            />
          )}
          <Hyperlocal />
          {newListings.length > 0 && (
            <ListingSection
              title="Newly Added"
              subTitle="FRESH ON NEEDMET"
              listings={newListings}
              see_all_navigate="/listings/newly_added"
              bgColor="var(--background-secondary)"
            />
          )}
          <BusinessCTA bgColor={newListings.length > 0 ? "var(--background-secondary)" : undefined} />
        </>
      )}
    </>
  );
}

export default ListingDetails;
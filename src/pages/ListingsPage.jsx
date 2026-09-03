import { useParams, useLocation } from "react-router-dom";
import { useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getNewListingsPaginated,
  getListingByCategoryPaginated,
  getRecommendedListingsPaginated,
  getSimilarListingsPaginated,
  getListingById,
} from "../services/firebase/firestore/listingService";
import { BusinessCTA, ListingSection, ListingSectionLoader, SystemState, SEO } from "../components";
import ErrorImg from "../assets/error.png";
import { useCategories } from "../hooks/useAllCategories";
import { generateSlug } from "../utils/slugify.js";

const QUANTITY = 20;
const title_decide = (type, category_name) => {
  if (category_name) return `Category: ${decodeURIComponent(category_name)}`;
  if (type === "recommended") return "Recommended For You";
  if (type === "newly_added") return "Newly Added";
  if (type === "similar") return "Similar Listings";
  return "All Listings";
};

const generateKey = (type, category_name, listingId) => {
  if (category_name) return ['listings-infinite', 'category', category_name];
  if (listingId) return ['listings-infinite', 'similar', listingId];
  return ['listings-infinite', type || 'all'];
}


const ListingsPage = () => {
  const { state } = useLocation();
  const { category_slug, listingId } = useParams();
  let { type } = useParams();

  const { data: allCategories = [] } = useCategories();

  // Resolve category slug to database category name
  const matchedCategory = allCategories.find(cat => generateSlug(cat.name) === category_slug);
  const category_name = matchedCategory ? matchedCategory.name : (category_slug || "");
  const isCategoryResolving = !!category_slug && allCategories.length === 0;

  type = listingId ? "similar" : type; 
  const title = state?.title || title_decide(type, category_name);
  const sentinelRef = useRef(null);

  const getSeoMetadata = () => {
    let seoTitle = "Local Business Listings | NeedMet";
    let seoDescription = "Find top-rated services and businesses. View ratings, maps, phone numbers, and operational hours.";

    if (category_name) {
      const decodedCategory = decodeURIComponent(category_name);
      seoTitle = `Best ${decodedCategory} Services | NeedMet`;
      seoDescription = `Find the best ${decodedCategory} services and businesses on NeedMet. View ratings, customer reviews, contact details, maps, and hours.`;
    } else if (type === "recommended") {
      seoTitle = "Recommended Local Businesses | NeedMet";
      seoDescription = "Discover top-rated local services and businesses handpicked for you on NeedMet.";
    } else if (type === "newly_added") {
      seoTitle = "Newly Added Local Businesses | NeedMet";
      seoDescription = "Check out the latest local service providers, shops, and businesses newly added to NeedMet.";
    } else if (type === "similar") {
      seoTitle = "Similar Local Businesses | NeedMet";
      seoDescription = "Explore similar local services, shops, and businesses near you on NeedMet.";
    }

    return { seoTitle, seoDescription };
  };

  const { seoTitle, seoDescription } = getSeoMetadata();
  const canonicalUrl = category_slug 
    ? `https://needmet.in/listings/category/${category_slug}` 
    : type 
      ? `https://needmet.in/listings/${type}` 
      : undefined;

  const { 
    data: listingData, 
    isLoading: listingIsLoading, 
    error: listingError 
  }  = useQuery({
    queryKey: ['listingById', listingId],
    queryFn: () => getListingById(listingId),
    enabled: type === "similar" && !!listingId,
  });

  const similar_category = listingData?.category ?? "";

  const { fetchFn, params } = resolveQuery({ type, category_name, listingId, similar_category });

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: generateKey(type, category_name, listingId),
    queryFn: ({ pageParam = null }) => fetchFn({ ...params, quantity: QUANTITY, pageParam }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.lastDoc : undefined,
    enabled: !!fetchFn && !isCategoryResolving && (type === "similar" ? similar_category !== '' : true),
    onSuccess: (data) => console.log(data),
    onError: (error) => console.log(error),
  });

  const listings = data?.pages.flatMap((p) => p.listings) ?? [];

  const handleObserver = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  const isPageLoading = isLoading || listingIsLoading || isCategoryResolving;
  if (isPageLoading) return <ListingSectionLoader count={QUANTITY} showSeeAll={false} />;

  if(error) {
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

  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={canonicalUrl}
      />
      <div className="listing-page-body">
        <ListingSection title={title} listings={listings} showSeeAll={false} />

        <>
          {isFetchingNextPage && (
            <div style={{ padding: "0 16px" }}>
              <ListingSectionLoader count={QUANTITY} showSeeAll={false} />
            </div>
          )}
          <div
            ref={sentinelRef}
            style={{ height: "1px", width: "100%", marginBottom: "40px" }}
          />
        </>
      </div>

      <BusinessCTA />
    </>
  );
};

function resolveQuery({ type, category_name, listingId, similar_category }) {
  if (category_name) {
    return {
      fetchFn: getListingByCategoryPaginated,
      params: { category: [decodeURIComponent(category_name)] },
    };
  }
  else if (type === "recommended") {
    return { fetchFn: getRecommendedListingsPaginated, params: {} };
  }
  else if (type === "newly_added") {
    return { fetchFn: getNewListingsPaginated, params: {} };
  }
  else if (type === "similar") {
    return {
      fetchFn: getSimilarListingsPaginated,
      params: { listingId, category: similar_category },
    };
  }
  return { fetchFn: getNewListingsPaginated, params: {} };
}

export default ListingsPage;
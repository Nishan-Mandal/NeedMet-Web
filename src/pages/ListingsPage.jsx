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
import { ListingSection, ListingSectionLoader, SystemState } from "../components";
import ErrorImg from "../assets/error.png";

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
  const { category_name, listingId } = useParams();
  let { type } = useParams();

  type = listingId ? "similar" : type; 
  const title = state?.title || title_decide(type, category_name);
  const sentinelRef = useRef(null);

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
    enabled: !!fetchFn && (type === "similar" ? similar_category !== '' : true),
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

  if (isLoading || listingIsLoading) return <ListingSectionLoader count={QUANTITY} showSeeAll={false} />;

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
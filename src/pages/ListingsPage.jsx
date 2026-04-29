import { useParams, useLocation } from "react-router-dom";
import { useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getNewListingsPaginated,
  getListingByCategoryPaginated,
  getRecommendedListingsPaginated,   // ← was missing
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


const ListingsPage = () => {
  const { state } = useLocation();
  const { type, category_name } = useParams();

  const title = state?.title || title_decide(type, category_name);

  const sentinelRef = useRef(null);

  const { fetchFn, params } = resolveQuery({ type, category_name });

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["listings-infinite", type, category_name],
    queryFn: ({ pageParam = null }) => fetchFn({ ...params, quantity: QUANTITY, pageParam }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.lastDoc : undefined,
    enabled: !!fetchFn,
    onSuccess: (data) => console.log(data),
    onError: (error) => console.log(error),
  });

  const listings = data?.pages.flatMap((p) => p.listings) ?? [];

  // ── Observer callback is stable; re-runs only when these change ──
  const handleObserver = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  // ── Re-observe whenever the callback or sentinel changes ──
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

  if (isLoading) return <ListingSectionLoader count={QUANTITY} showSeeAll={false} />;

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

function resolveQuery({ type, category_name }) {
  if (category_name) {
    return {
      fetchFn: getListingByCategoryPaginated,
      params: { category: [decodeURIComponent(category_name)] },
    };
  }
  if (type === "recommended") {
    return { fetchFn: getRecommendedListingsPaginated, params: {} };
  }
  if (type === "newly_added") {
    return { fetchFn: getNewListingsPaginated, params: {} };
  }
  if (type === "similar") {
    return { fetchFn: getListingByCategoryPaginated, params: { category: [] } };
  }
  return { fetchFn: getNewListingsPaginated, params: {} };
}

export default ListingsPage;
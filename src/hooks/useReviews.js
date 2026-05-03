import { useInfiniteQuery } from "@tanstack/react-query";
import { getReviews } from "../services/firebase/firestore/reviewService";

export const useReviews = (listingId, pageSize = 4) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["reviews", listingId],
    queryFn: ({ pageParam = null }) =>
      getReviews({ listingId, pageSize, lastDoc: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.lastDoc : undefined,
    initialPageParam: null,
    enabled: !!listingId, // don't fetch if listingId is undefined
  });

  const reviews = data?.pages.flatMap((page) => page.reviews) ?? [];

  return {
    reviews,
    loading: isLoading,
    isFetchingMore: isFetchingNextPage,
    hasMore: !!hasNextPage,
    loadMore: fetchNextPage,
    isError,
  };
};
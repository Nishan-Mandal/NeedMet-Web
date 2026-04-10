import { useState, useEffect } from "react";
import { getReviews } from "../services/firebase/firestore/reviewService";

export const useReviews = (listingId, pageSize = 5) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchReviews = async (isLoadMore = false) => {
    if (!listingId || loading) return;

    try {
      setLoading(true);

      const { reviews: newReviews, lastDoc: newLastDoc, hasMore } =
        await getReviews({
          listingId,
          pageSize,
          lastDoc: isLoadMore ? lastDoc : null
        });

      setReviews((prev) =>
        isLoadMore ? [...prev, ...newReviews] : newReviews
      );

      setLastDoc(newLastDoc);
      setHasMore(hasMore);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setReviews([]);
    setLastDoc(null);
    setHasMore(true);

    fetchReviews(false);
  }, [listingId]);

  return {
    reviews,
    loading,
    hasMore,
    loadMore: () => fetchReviews(true)
  };
};
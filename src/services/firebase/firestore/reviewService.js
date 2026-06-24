import {
  collection,
  query,
  limit,
  getDocs,
  startAfter,
  orderBy, 
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "../../../firebase/firebaseConfig";

const formatData = (snap) => {
    return snap.docs.map((doc) => ({
        id: doc.id, 
        ...doc.data()
    }));
};

export const getReviews = async ({listingId, pageSize, lastDoc = null}) => {
  try {
    const ref = collection(
      firestore,
      "listings",
      listingId,
      "reviews"
    );

    let q = query(
      ref,
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(
        ref,
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const snap = await getDocs(q);

    const reviews = formatData(snap);

    return {
      reviews,
      lastDoc: snap.docs[snap.docs.length - 1] || null,
      hasMore: snap.docs.length === pageSize
    };

  } catch (error) {
    console.error("Error fetching reviews:", error);
    return {
      reviews: [],
      lastDoc: null,
      hasMore: false
    };
  }
};

export const submitListingReview = async ({
  listingId,
  factorRatings,
  comment,
}) => {
  try {
    const listingRef = doc(firestore, "listings", listingId);

    const validValues = Object.values(factorRatings).filter(
      (v) => v > 0
    );

    if (!validValues.length) {
      throw new Error("At least one rating is required");
    }

    const avgRating = Math.round(validValues.reduce((a, b) => a + b, 0) / validValues.length);

    const isRatingOnly = comment.trim() === "";

    await runTransaction(firestore, async (transaction) => {
      const listingSnap = await transaction.get(listingRef);

      if (!listingSnap.exists()) {
        throw new Error("Listing not found");
      }

      const data = listingSnap.data();

      const currentRating = data.rating || 0;
      const currentReviews = data.reviews || 0;
      const currentRatingCount = data.ratingCount || 0;

      const ratingStats = {
        ...(data.ratingStats || {}),
      };

      const ratingKey = avgRating.toString();

      ratingStats[ratingKey] =
        (ratingStats[ratingKey] || 0) + 1;

      const factorAvgRatings = {
        ...(data.factorAvgRatings || {}),
      };

      Object.entries(factorRatings).forEach(([key, value]) => {
        if (value <= 0) return;

        const oldAvg = factorAvgRatings[key] || 0;

        const newAvg =
          ((oldAvg * currentReviews) + value) /
          (currentReviews + 1);

        factorAvgRatings[key] = Number(newAvg.toFixed(1));
      });

      const newListingRating =
        ((currentRating * currentReviews) + avgRating) /
        (currentReviews + 1);

      const reviewRef = doc(
        collection(firestore, "listings", listingId, "reviews")
      );

      const reviewData = {
        reviewId: reviewRef.id,
        userId: "anonymous",
        userName: "Anonymous",
        rating: avgRating,
        factorRatings,
        comment,
        createdAt: serverTimestamp(),
      };

      transaction.set(reviewRef, reviewData);

      transaction.update(listingRef, {
        rating: Number(newListingRating.toFixed(1)),
        reviews: currentReviews + 1,
        ratingCount: isRatingOnly
          ? currentRatingCount + 1
          : currentRatingCount,
        ratingStats,
        factorAvgRatings,
        updatedAt: serverTimestamp(),
      });
    });

    return {
      success: true,
      message: "Review submitted successfully",
    };

  } catch (error) {
    console.error("Error submitting review:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};
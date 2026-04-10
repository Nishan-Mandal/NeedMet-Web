import {
  collection,
  query,
  limit,
  getDocs,
  startAfter,
  orderBy
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
    console.log('[Api Call] getReviews -> start');
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

    console.log('[Api Call] getReviews -> end');

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
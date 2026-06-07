import { firestore } from "../../../firebase/firebaseConfig";
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc, startAfter, documentId } from "firebase/firestore";
import { Listing } from "../../../data/model/listingModel";



const formatData = (snap) => {
  return snap.docs.map((doc) =>
    Listing.fromJson({
      listingId: doc.id,
      ...doc.data(),
    })
  );
};


const verificationConstraints = import.meta.env.DEV
  ? []
  : [
      where("verifiedBy", "!=", null),
    ];

const listingRef = collection(firestore, "listings");


export const getListingById = async (listingId) => {
  try {
    const ref = doc(firestore, "listings", listingId);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return Listing.fromJson({
        listingId: snap.id,
        ...snap.data()
    });

  } catch (error) {
    console.error("Error fetching listing:", error);
    return null;
  }
};

export const getListingByIds = async (ids) => {
  try{
    if (!ids.length) return [];

    let fetchedListings = [];

    // Firestore allows max 10 IDs
    for (let i = 0; i < ids.length; i += 10) {

      const chunk = ids.slice(i, i + 10);

      const q = query(
        listingRef,
        where(documentId(), "in", chunk)
      );

      const snap = await getDocs(q);

      const listingsChunk = formatData(snap);

      fetchedListings.push(...listingsChunk);
    }

    return fetchedListings;
  } catch (error) {
    console.error("Error fetching listing:", error);
    return [];
  }
}

export const getListingByCategory = async ({ category, quantity }) => {
    try {
        if (!category || category.length === 0) return [];
        
        const q = query(
            listingRef,
            ...verificationConstraints, 
            where("category", "in", category),
            limit(quantity)
        );
        const snap = await getDocs(q);
        
        return formatData(snap);

    } catch(error) {
        console.error("Error fetching listings:", error);
        return [];
    }
}

export const getListingByCategoryPaginated = async ({ category, quantity = 20, pageParam = null }) => {
    try {
        if (!category || category.length === 0) 
            return { 
                listings: [], 
                lastDoc: null, 
                hasMore: false 
            };

        let q = query(
            listingRef,
            ...verificationConstraints, 
            where("category", "in", category),
            limit(quantity)
        );
        if (pageParam) q = query(
            listingRef,
            ...verificationConstraints, 
            where("category", "in", category),
            startAfter(pageParam),
            limit(quantity)
        );

        const snap = await getDocs(q);
        const lastDoc = snap.docs[snap.docs.length - 1] ?? null;

        return { 
            listings: formatData(snap), 
            lastDoc, 
            hasMore: snap.docs.length === quantity 
        };

    } catch (error) {
        console.error("Error fetching listings:", error);
        return { 
            listings: [], 
            lastDoc: null, 
            hasMore: false 
        };
    }
};

export const getNewListings = async ({ quantity }) => {
    try {
        const q = query(
            listingRef,
            ...verificationConstraints,
            orderBy("createdAt", "desc"),
            limit(quantity)
        );
        const snap = await getDocs(q);

        return formatData(snap);
    
    } catch(error) {
        console.error("Error fetching listings:", error);
        return [];
    }
};

export const getNewListingsPaginated = async ({ quantity = 20, pageParam = null }) => {
    try {
        let q = query(
            listingRef,
            ...verificationConstraints,
            orderBy("createdAt", "desc"),
            limit(quantity)
        );
        if (pageParam) q = query(
            listingRef,
            ...verificationConstraints, 
            orderBy("createdAt", "desc"),
            startAfter(pageParam),
            limit(quantity)
        );

        const snap = await getDocs(q);
        const lastDoc = snap.docs[snap.docs.length - 1] ?? null;

        return { 
            listings: formatData(snap), 
            lastDoc, 
            hasMore: snap.docs.length === quantity 
        };

    } catch (error) {
        console.error("Error fetching listings:", error);
        return { 
            listings: [], 
            lastDoc: null, 
            hasMore: false 
        };
    }
};

export const getRecommendedListings = async ({ quantity }) => {
    try {
        const q = query(
            listingRef,
            ...verificationConstraints,
            where("tags", "array-contains", "recommended"),
            limit(quantity)
        );
        const snap = await getDocs(q);

        return formatData(snap);
    
    } catch(error) {
        console.error("Error fetching listings:", error);
        return [];
    }
};

export const getRecommendedListingsPaginated = async ({ quantity = 20, pageParam = null }) => {
    try {
        let q = query(
            listingRef,
            ...verificationConstraints, 
            where("tags", "array-contains", "recommended"),
            limit(quantity)
        );
        if (pageParam) q = query(
            listingRef,
            ...verificationConstraints, 
            where("tags", "array-contains", "recommended"),
            startAfter(pageParam),
            limit(quantity)
        );

        const snap = await getDocs(q);
        const lastDoc = snap.docs[snap.docs.length - 1] ?? null;

        return { 
            listings: formatData(snap), 
            lastDoc, 
            hasMore: snap.docs.length === quantity 
        };

    } catch (error) {
        console.error("Error fetching listings:", error);
        return { 
            listings: [], 
            lastDoc: null, 
            hasMore: false 
        };
    }
};

export const getSimilarListings = async ({ listingId, category, quantity }) => {
    try {
        if (!category || category.length === 0) return [];

        const q = query(
            listingRef,
            ...verificationConstraints,
            where("category", "==", category),
            limit(quantity)
        );
        const snap = await getDocs(q);
        
        let totalListings = formatData(snap);
        totalListings = totalListings
            .filter(listing => 
                listing.listingId !== listingId
        );

        return totalListings;

    } catch (error) {
        console.error("Error fetching similar listings:", error);
        return [];
    }
};

export const getSimilarListingsPaginated = async ({ listingId, category, quantity = 20, pageParam = null }) => {
    try {
        if (!category || category.length === 0)
            return {
                listings: [],
                lastDoc: null,
                hasMore: false
            };

        let q = query(
            listingRef, 
            ...verificationConstraints,
            where("category", "==", category),
            limit(quantity)
        );
        if (pageParam) q = query(
            listingRef,
            ...verificationConstraints,
            where("category", "==", category),
            where(documentId(), "!=", listingId),
            startAfter(pageParam),
            limit(quantity)
        );

        const snap = await getDocs(q);
        const lastDoc = snap.docs[snap.docs.length - 1] ?? null;

        return {
            listings: formatData(snap),
            lastDoc,
            hasMore: snap.docs.length === quantity
        };

    } catch (error) {
        console.error("Error fetching similar listings:", error);
        return {
            listings: [],
            lastDoc: null,
            hasMore: false
        };
    }
};
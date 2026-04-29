import { firestore } from "../../../firebase/firebaseConfig";
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc, startAfter } from "firebase/firestore";
import { Listing } from "../../../data/model/listingModel";



export const getListingById = async (listingId) => {
  try {
    console.log('[Api Call] getListingById -> start');

    const ref = doc(firestore, "listings", listingId);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    console.log('[Api Call] getListingById -> end');

    return Listing.fromJson({
        listingId: snap.id,
        ...snap.data()
    });

  } catch (error) {
    console.error("Error fetching listing:", error);
    return null;
  }
};


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
      orderBy("verifiedBy")
    ];

const listingRef = collection(firestore, "listings");

export const getListingByCategory = async ({ category, quantity }) => {
    try {
        if (!category || category.length === 0) return [];
        
        console.log('[Api Call] getListingByCategory -> start');

        const q = query(
            listingRef,
            ...verificationConstraints, 
            where("category", "in", category),
            limit(quantity)
        );
        const snap = await getDocs(q);

        console.log('[Api Call] getListingByCategory -> end');
        
        return formatData(snap);

    } catch(error) {
        console.error("Error fetching listings:", error);
        return [];
    }
}

export const getListingByCategoryPaginated = async ({ category, quantity = 20, pageParam = null }) => {
    try {
        console.log('[Api Call] getListingByCategoryPaginated -> start');

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

        console.log('[Api Call] getListingByCategoryPaginated -> end');

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
        console.log('[Api Call] getNewListings -> start');

        const q = query(
            listingRef,
            ...verificationConstraints,
            orderBy("createdAt", "desc"),
            limit(quantity)
        );
        const snap = await getDocs(q);

        console.log('[Api Call] getNewListings -> end');

        return formatData(snap);
    
    } catch(error) {
        console.error("Error fetching listings:", error);
        return [];
    }
};

export const getNewListingsPaginated = async ({ quantity = 20, pageParam = null }) => {
    try {
        console.log('[Api Call] getNewListingsPaginated -> start');

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

        console.log('[Api Call] getNewListingsPaginated -> end');

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
        console.log('[Api Call] getRecommendedListings -> start');
        
        const q = query(
            listingRef,
            ...verificationConstraints,
            where("tags", "array-contains", "recommended"),
            limit(quantity)
        );
        const snap = await getDocs(q);

        console.log('[Api Call] getRecommendedListings -> end');

        return formatData(snap);
    
    } catch(error) {
        console.error("Error fetching listings:", error);
        return [];
    }
};

export const getRecommendedListingsPaginated = async ({ quantity = 20, pageParam = null }) => {
    try {
        console.log('[Api Call] getRecommendedListingsPaginated -> start');

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

        console.log('[Api Call] getRecommendedListingsPaginated -> end');

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
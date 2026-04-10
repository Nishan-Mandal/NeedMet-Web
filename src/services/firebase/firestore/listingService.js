import { firestore } from "../../../firebase/firebaseConfig";
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from "firebase/firestore";
import { Listing } from "../../../data/model/listingModel";



export const getListingById = async (listingId) => {
  try {
    console.log('[Api Call] getListingById -> start');

    const ref = doc(firestore, "listings", listingId);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    console.log('[Api Call] getListingById -> end');

    // return {
    //   id: snap.id,
    //   ...snap.data()
    // };

    return Listing.fromJson({
        listingId: snap.id,
        ...snap.data()
    });

  } catch (error) {
    console.error("Error fetching listing:", error);
    return null;
  }
};



// const formatData = (snap) => {
//     return snap.docs.map((doc) => ({
//         id: doc.id, 
//         ...doc.data()
//     }));
// };

const formatData = (snap) => {
  return snap.docs.map((doc) =>
    Listing.fromJson({
      listingId: doc.id,
      ...doc.data(),
    })
  );
};

const listingRef = collection(firestore, "listings");

// export const getAllListings = async ({ quantity }) => {
//     try {
//         console.log('[Api Call] getAllListings -> start');

//         const q = query(listingRef, limit(quantity));
//         const snap = await getDocs(q);

//         console.log('[Api Call] getAllListings -> end');
        
//         return formatData(snap);

//     } catch(error) {
//         console.error("Error fetching listings:", error);
//         return [];
//     }
// }

export const getListingByCategory = async ({ category, quantity }) => {
    try {
        if (!category || category.length === 0) return [];
        
        console.log('[Api Call] getListingByCategory -> start');

        const q = query(listingRef, where("category", "in", category), limit(quantity));
        const snap = await getDocs(q);

        console.log('[Api Call] getListingByCategory -> end');
        
        return formatData(snap);

    } catch(error) {
        console.error("Error fetching listings:", error);
        return [];
    }
}

// export const getListingsByCategoryId = async ({ categoryId }) => {
//     try {
//         console.log('[Api Call] getListingsByCategory -> start');

//         const q = query(listingRef, where("categoryId", "==", categoryId));
//         const snap = await getDocs(q);

//         console.log('[Api Call] getListingsByCategory -> end');

//         return formatData(snap);
            
//     } catch(error) {
//         console.error("Error fetching listings:", error);
//         return [];
//     }
// };

export const getNewListings = async ({ quantity }) => {
    try {
        console.log('[Api Call] getNewListings -> start');
        
        const q = query(listingRef, orderBy("createdAt", "desc"), limit(quantity));
        const snap = await getDocs(q);

        console.log('[Api Call] getNewListings -> end');

        return formatData(snap);
    
    } catch(error) {
        console.error("Error fetching listings:", error);
        return [];
    }
};

// export const getRecommendedListings = async ({ quantity }) => {
//     try {
//         console.log('[Api Call] getRecommendedListings -> start');
        
//         const q = query(listingRef, where("claimStatus", "==", "approved"), limit(quantity));
//         const snap = await getDocs(q);

//         console.log('[Api Call] getRecommendedListings -> end');

//         return formatData(snap);
    
//     } catch(error) {
//         console.error("Error fetching listings:", error);
//         return [];
//     }
// };
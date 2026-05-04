import { firestore } from "../../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export const getPageById = async (id) => {
  try {
    console.log('[Api Call] getPageById -> start');

    const docRef = doc(firestore, "pages", id);
    const snap = await getDoc(docRef);

    console.log('[Api Call] getPageById -> end');

    if (snap.exists()) {
      return {
        id: snap.id,
        ...snap.data(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
};
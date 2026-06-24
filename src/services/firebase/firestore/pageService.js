import { firestore } from "../../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export const getPageById = async (id) => {
  try {
    const docRef = doc(firestore, "pages", id);
    const snap = await getDoc(docRef);

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
import { firestore } from "../../../firebase/firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";
import { Category } from '../../../data/model/categeryModel';

export const getAllCategory = async () => {
    try {
        const categoryRef = collection(firestore, "categories");

        const q = query(categoryRef);
        const snap = await getDocs(q);

        const data = snap.docs.map(doc => 
            Category.fromJson({
                id: doc.id,
                ...doc.data()
            })
        );

        return data;

    } catch (error) {
        console.error("Error fetching all category details:", error);
        return [];
    }
};
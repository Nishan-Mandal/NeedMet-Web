import { firestore } from "../../../firebase/firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";
import { Category } from '../../../data/model/categeryModel';

export const getAllCategory = async () => {
    try {
        console.log('[Api Call] getAllCategory -> start');

        const categoryRef = collection(firestore, "categories");

        const q = query(categoryRef);
        const snap = await getDocs(q);

        console.log('[Api Call] getAllCategory -> end');

        // Convert snapshot to usable data
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
import { firestore } from "../../../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Home } from '../../../data/model/HomeModel'

export const getHomeDetails = async () => {
    try {
        console.log('[Api Call] getHomeDetails -> start');

        const homeRef = collection(firestore, "home");

        const q = query(homeRef, where("active", "==", true));
        const snap = await getDocs(q);

        console.log('[Api Call] getHomeDetails -> end');

        // Convert snapshot to usable data
        const data = snap.docs.map(doc => 
            Home.fromJson({
                id: doc.id,
                ...doc.data()
            })
        );

        return data.length > 0 ? data[0] : [];

    } catch (error) {
        console.error("Error fetching home details:", error);
        return [];
    }
};
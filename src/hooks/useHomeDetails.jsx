import { useEffect, useState } from "react";
import { getHomeDetails } from "../services/firebase/firestore/homeService";
import { getCache, setCache } from "../utils/cache";

const CACHE_KEY = "homeDetails";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useHomeDetails = () => {
    const [homeData, setHomeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHome = async () => {
            try {
                const cachedData = getCache(CACHE_KEY);

                if (cachedData) {
                    console.log("[Cache Hit]", CACHE_KEY);
                    setHomeData(cachedData);
                    setLoading(false);
                    return;
                }

                const data = await getHomeDetails();

                console.log('[Cache Set]', CACHE_KEY)
                setCache(CACHE_KEY, data, CACHE_TTL);
                setHomeData(data);

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHome();
    }, []);

    return { homeData, loading, error };
};
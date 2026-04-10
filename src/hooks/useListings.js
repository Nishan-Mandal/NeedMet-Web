import { useState, useEffect } from "react";
import { getCache, setCache } from "../utils/cache";

export const useListings = (fetchFunction, params = {}, enabled = true) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const cacheKey = fetchFunction?.name + "_" + JSON.stringify(params);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const cached = getCache(cacheKey);
      if (cached) {
        console.log("[Cache Hit]", cacheKey);
        setListings(cached);
        setLoading(false);
        return;
      }

      const data = await fetchFunction(params);

      if(data.length > 0) {
        console.log('[Cache Set]', cacheKey)
        setCache(cacheKey, data, 5 * 60 * 1000);
  
        setListings(data || []);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!fetchFunction || !enabled) {
      setLoading(false);
      return;
    }

    fetchData();
  }, [fetchFunction, enabled, JSON.stringify(params)]);

  return { listings, loading, error };
};
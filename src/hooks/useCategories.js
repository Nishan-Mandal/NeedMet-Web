import { useState, useEffect } from "react";
import { getCache, setCache } from "../utils/cache";
import { getAllCategory } from "../services/firebase/firestore/categoryService";

export const useCategories = (enabled = true) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const cacheKey = "categories_all";

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const cached = getCache(cacheKey);
      if (cached) {
        console.log("[Cache Hit]", cacheKey);
        setCategories(cached);
        setLoading(false);
        return;
      }

      const data = await getAllCategory();

      if (data && data.length > 0) {
        console.log("[Cache Set]", cacheKey);

        setCache(cacheKey, data, 5 * 60 * 1000);
        setCategories(data);
      } else {
        setCategories([]);
      }

    } catch (err) {
      console.error("Error in useCategories:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    fetchCategories();
  }, [enabled]);

  return { categories, loading, error };
};
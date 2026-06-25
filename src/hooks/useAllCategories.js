import { useQuery } from "@tanstack/react-query";
import { getAllCategory } from "../services/firebase/firestore/categoryService";

export const CATEGORY_QUERY_KEY = ["all-category"];

export const useCategories = () => {
  return useQuery({
    queryKey: CATEGORY_QUERY_KEY,
    queryFn: getAllCategory,

    // category changes very rarely
    staleTime: Infinity,
    gcTime: 1 * 24 * 60 * 60 * 1000,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
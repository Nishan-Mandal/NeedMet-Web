import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getArticlesPaginated,
  getArticleByIdOrSlug,
  getFeaturedArticles,
  getRelatedArticles,
  getOtherArticles,
  checkUserArticleLike,
  toggleArticleLike,
} from "../services/firebase/firestore/articleService";
import { useAuth } from "../contexts/authContext";

export const ARTICLE_QUERY_KEYS = {
  all: ["articles"],
  infinite: (category) => ["articles", "infinite", category || "all"],
  detail: (idOrSlug) => ["articles", "detail", idOrSlug],
  featured: ["articles", "featured"],
  related: (category, id) => ["articles", "related", category, id],
  other: (id) => ["articles", "other", id],
  likeStatus: (articleId, userId) => ["articles", "like_status", articleId, userId || "anonymous"],
};

/**
 * Hook for infinite scrolling / pagination of articles matching ListingsPage pattern.
 */
export const useArticlesInfinite = ({ category = "all", quantity = 12 } = {}) => {
  return useInfiniteQuery({
    queryKey: ARTICLE_QUERY_KEYS.infinite(category),
    queryFn: ({ pageParam = null }) =>
      getArticlesPaginated({ quantity, pageParam, category }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.lastDoc : undefined),
    initialPageParam: null,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000,    // 1 hour
  });
};

/**
 * Hook for fetching a single article by ID or slug.
 */
export const useArticleDetails = (idOrSlug) => {
  return useQuery({
    queryKey: ARTICLE_QUERY_KEYS.detail(idOrSlug),
    queryFn: () => getArticleByIdOrSlug(idOrSlug),
    enabled: Boolean(idOrSlug),
    staleTime: 15 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
};

/**
 * Hook for fetching featured/spotlight articles.
 */
export const useFeaturedArticles = ({ quantity = 3 } = {}) => {
  return useQuery({
    queryKey: ARTICLE_QUERY_KEYS.featured,
    queryFn: () => getFeaturedArticles({ quantity }),
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

/**
 * Hook for fetching related articles.
 */
export const useRelatedArticles = ({ category, currentId, quantity = 3 } = {}) => {
  return useQuery({
    queryKey: ARTICLE_QUERY_KEYS.related(category, currentId),
    queryFn: () => getRelatedArticles({ category, currentId, quantity }),
    enabled: Boolean(currentId),
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

/**
 * Hook for fetching other recent articles (for sidebar and recommendations).
 */
export const useOtherArticles = ({ currentId, quantity = 10 } = {}) => {
  return useQuery({
    queryKey: ARTICLE_QUERY_KEYS.other(currentId),
    queryFn: () => getOtherArticles({ currentId, quantity }),
    enabled: Boolean(currentId),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

/**
 * Hook to check if the current user has liked an article.
 */
export const useArticleLikeStatus = (articleId) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;

  return useQuery({
    queryKey: ARTICLE_QUERY_KEYS.likeStatus(articleId, userId),
    queryFn: () => checkUserArticleLike(articleId, userId),
    enabled: Boolean(articleId && userId),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to toggle article like with optimistic UI updates.
 * Throws error if user is not authenticated.
 */
export const useToggleArticleLike = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  return useMutation({
    mutationFn: ({ articleId }) => {
      const userId = currentUser?.uid;
      if (!userId) {
        throw new Error("You must be logged in to like this guide.");
      }
      return toggleArticleLike({ articleId, userId });
    },
    onMutate: async ({ articleId }) => {
      const userId = currentUser?.uid;
      if (!userId) return;

      const statusKey = ARTICLE_QUERY_KEYS.likeStatus(articleId, userId);
      const detailKey = ARTICLE_QUERY_KEYS.detail(articleId);

      await queryClient.cancelQueries({ queryKey: statusKey });
      await queryClient.cancelQueries({ queryKey: detailKey });

      const prevStatus = queryClient.getQueryData(statusKey);
      const prevArticle = queryClient.getQueryData(detailKey);

      // Optimistically flip the like status
      queryClient.setQueryData(statusKey, !prevStatus);

      // Optimistically update likesCount on the cached article
      if (prevArticle) {
        const delta = prevStatus ? -1 : 1;
        queryClient.setQueryData(detailKey, {
          ...prevArticle,
          likesCount: Math.max(0, (prevArticle.likesCount || 0) + delta),
        });
      }

      return { prevStatus, prevArticle, statusKey, detailKey };
    },
    onError: (err, variables, context) => {
      if (context?.prevStatus !== undefined) {
        queryClient.setQueryData(context.statusKey, context.prevStatus);
      }
      if (context?.prevArticle) {
        queryClient.setQueryData(context.detailKey, context.prevArticle);
      }
    },
    onSettled: (data, error, { articleId }) => {
      const userId = currentUser?.uid;
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ARTICLE_QUERY_KEYS.likeStatus(articleId, userId) });
      }
      queryClient.invalidateQueries({ queryKey: ARTICLE_QUERY_KEYS.detail(articleId) });
      queryClient.invalidateQueries({ queryKey: ARTICLE_QUERY_KEYS.all });
    },
  });
};



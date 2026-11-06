import { firestore } from "../../../firebase/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  startAfter,
  where,
} from "firebase/firestore";
import { Article } from "../../../data/model/articleModel";

const COLLECTION_NAME = "gen_articles";

/**
/**
 * Fetch paginated articles from Firestore's gen_articles collection.
 * Uses Firebase inbuilt cursor pagination (startAfter + limit) matching listingService.js.
 */
export const getArticlesPaginated = async ({
  quantity = 12,
  pageParam = null,
  category = null,
} = {}) => {
  const articlesRef = collection(firestore, COLLECTION_NAME);

  try {
    let snap;
    const hasCategory = category && category !== "all";

    if (hasCategory) {
      try {
        const constraints = [
          where("category", "==", category),
          orderBy("created_at", "desc"),
          limit(quantity),
        ];
        if (pageParam) constraints.push(startAfter(pageParam));
        const q = query(articlesRef, ...constraints);
        snap = await getDocs(q);
      } catch (indexErr) {
        console.warn("Category + orderBy requires composite index, falling back to where without orderBy:", indexErr.message);
        const fallbackConstraints = [where("category", "==", category), limit(quantity)];
        if (pageParam) fallbackConstraints.push(startAfter(pageParam));
        const qFallback = query(articlesRef, ...fallbackConstraints);
        snap = await getDocs(qFallback);
      }
    } else {
      const constraints = [orderBy("created_at", "desc"), limit(quantity)];
      if (pageParam) {
        constraints.push(startAfter(pageParam));
      }
      const q = query(articlesRef, ...constraints);
      snap = await getDocs(q);
    }
    const lastDoc = snap.docs[snap.docs.length - 1] ?? null;

    const articles = snap.docs.map((docSnap) =>
      Article.fromJson({
        id: docSnap.id,
        ...docSnap.data(),
      })
    );

    return {
      articles,
      lastDoc,
      hasMore: snap.docs.length === quantity,
    };
  } catch (error) {
    console.error("Error reading articles from Firestore gen_articles:", error);
    return {
      articles: [],
      lastDoc: null,
      hasMore: false,
    };
  }
};

/**
 * Fetch a single article by either document ID or slug from gen_articles.
 */
export const getArticleByIdOrSlug = async (idOrSlug) => {
  if (!idOrSlug) return null;

  try {
    // 1. Try direct ID lookup
    const docRef = doc(firestore, COLLECTION_NAME, idOrSlug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return Article.fromJson({
        id: docSnap.id,
        ...docSnap.data(),
      });
    }

    // 2. Try slug query
    const articlesRef = collection(firestore, COLLECTION_NAME);
    const q = query(articlesRef, where("slug", "==", idOrSlug), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const firstDoc = snapshot.docs[0];
      return Article.fromJson({
        id: firstDoc.id,
        ...firstDoc.data(),
      });
    }
  } catch (error) {
    console.error(`Failed to fetch article '${idOrSlug}' from ${COLLECTION_NAME}:`, error);
  }

  return null;
};

/**
 * Fetch featured spotlight articles strictly from gen_articles.
 */
export const getFeaturedArticles = async ({ quantity = 3 } = {}) => {
  try {
    const articlesRef = collection(firestore, COLLECTION_NAME);

    // Try ordering by created_at descending
    try {
      const q = query(articlesRef, orderBy("created_at", "desc"), limit(quantity));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => Article.fromJson({ id: d.id, ...d.data() }));
      }
    } catch {
      // Ignore if order fails
    }

    // Fallback plain query
    const qFallback = query(articlesRef, limit(quantity));
    const snapFallback = await getDocs(qFallback);
    return snapFallback.docs.map((d) => Article.fromJson({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error(`Failed reading featured articles from ${COLLECTION_NAME}:`, error);
    return [];
  }
};

/**
 * Fetch related / additional articles from gen_articles (excluding currentId).
 */
export const getRelatedArticles = async ({ category, currentId, quantity = 3 } = {}) => {
  try {
    const articlesRef = collection(firestore, COLLECTION_NAME);

    // Fetch latest articles (ordering by created_at descending if possible)
    let snap;
    try {
      const q = query(articlesRef, orderBy("created_at", "desc"), limit(quantity + 2));
      snap = await getDocs(q);
    } catch {
      const qFallback = query(articlesRef, limit(quantity + 2));
      snap = await getDocs(qFallback);
    }

    if (!snap || snap.empty) return [];

    const articles = snap.docs
      .filter((d) => d.id !== currentId)
      .slice(0, quantity)
      .map((d) => Article.fromJson({ id: d.id, ...d.data() }));

    // If category provided, prefer matching category first
    if (category) {
      const matching = articles.filter((a) => a.category === category);
      const others = articles.filter((a) => a.category !== category);
      return [...matching, ...others].slice(0, quantity);
    }

    return articles;
  } catch (error) {
    console.error(`Failed reading related articles from ${COLLECTION_NAME}:`, error);
    return [];
  }
};

/**
 * Fetch other recent articles from gen_articles (excluding currentId) for sidebar & recommendations.
 */
export const getOtherArticles = async ({ currentId = "", quantity = 10 } = {}) => {
  try {
    const articlesRef = collection(firestore, COLLECTION_NAME);
    let snap;
    try {
      const q = query(articlesRef, orderBy("created_at", "desc"), limit(quantity + 2));
      snap = await getDocs(q);
    } catch {
      const qFallback = query(articlesRef, limit(quantity + 2));
      snap = await getDocs(qFallback);
    }

    if (!snap || snap.empty) return [];

    const articles = snap.docs
      .filter((d) => d.id !== currentId)
      .map((d) => Article.fromJson({ id: d.id, ...d.data() }));

    articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    return articles.slice(0, quantity);
  } catch (error) {
    console.error(`Failed reading other articles from ${COLLECTION_NAME}:`, error);
    return [];
  }
};

/**
 * Checks if a specific user has liked an article.
 * Looks up subcollection document: gen_articles/{articleId}/liked_by/{userId}
 */
export const checkUserArticleLike = async (articleId, userId) => {
  if (!articleId || !userId) return false;
  try {
    const likeDocRef = doc(firestore, COLLECTION_NAME, articleId, "liked_by", userId);
    const snap = await getDoc(likeDocRef);
    return snap.exists();
  } catch (error) {
    console.error("Error checking article like status:", error);
    return false;
  }
};

/**
 * Atomically toggles like status for an authenticated user.
 * Must be authenticated (userId required).
 * Uses runTransaction to update both the subcollection document
 * and the aggregated likes_count on the parent article document atomically.
 */
export const toggleArticleLike = async ({ articleId, userId }) => {
  if (!articleId) {
    throw new Error("Article ID is required to like an article.");
  }
  if (!userId) {
    throw new Error("You must be logged in to like this guide.");
  }

  const articleRef = doc(firestore, COLLECTION_NAME, articleId);
  const likeDocRef = doc(firestore, COLLECTION_NAME, articleId, "liked_by", userId);

  return await runTransaction(firestore, async (transaction) => {
    const [articleSnap, likeSnap] = await Promise.all([
      transaction.get(articleRef),
      transaction.get(likeDocRef),
    ]);

    if (!articleSnap.exists()) {
      throw new Error("Article does not exist.");
    }

    const currentLikes = articleSnap.data().likes_count || articleSnap.data().likesCount || 0;
    const isCurrentlyLiked = likeSnap.exists();

    if (isCurrentlyLiked) {
      // User is unliking: delete subcollection document & decrement likes_count
      transaction.delete(likeDocRef);
      const newCount = Math.max(0, currentLikes - 1);
      transaction.update(articleRef, { likes_count: newCount });
      return { liked: false, likesCount: newCount };
    } else {
      // User is liking: create subcollection document & increment likes_count
      transaction.set(likeDocRef, {
        userId,
        likedAt: serverTimestamp(),
      });
      const newCount = currentLikes + 1;
      transaction.update(articleRef, { likes_count: newCount });
      return { liked: true, likesCount: newCount };
    }
  });
};



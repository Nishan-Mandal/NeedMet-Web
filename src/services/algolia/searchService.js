const APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID;
const API_KEY = import.meta.env.VITE_ALGOLIA_SEARCH_KEY;

// In-memory cache for autocomplete queries to eliminate duplicate network calls (e.g. typing & backspacing)
const suggestionCache = new Map();
const MAX_CACHE_SIZE = 60;

let currentAbortController = null;

export class AlgoliaService {
  static async searchListings(query) {
    return this._search(query, "Listings");
  }

  static async searchCategories(query) {
    return this._search(query, "categories");
  }

  /**
   * Fast, cost-optimized autocomplete suggestion query.
   * Optimizations applied:
   * 1. Minimum 3 characters threshold - costs 0 requests for 1-2 chars.
   * 2. In-memory cache - repeated/backspaced queries cost 0 requests.
   * 3. AbortController - aborts stale in-flight requests during typing.
   * 4. Minimal attributes retrieved - speeds up payload and parsing.
   */
  static async getSuggestions(query, { hitsPerPage = 4 } = {}) {
    const trimmed = query?.trim() || "";
    if (trimmed.length < 3) return [];

    const cacheKey = trimmed.toLowerCase();
    if (suggestionCache.has(cacheKey)) {
      return suggestionCache.get(cacheKey);
    }

    // Abort previous in-flight suggestion request to save network contention
    if (currentAbortController) {
      currentAbortController.abort();
    }
    currentAbortController = new AbortController();

    try {
      const url = `https://${APP_ID}-dsn.algolia.net/1/indexes/Listings/query`;

      const response = await fetch(url, {
        method: "POST",
        signal: currentAbortController.signal,
        headers: {
          "X-Algolia-API-Key": API_KEY,
          "X-Algolia-Application-Id": APP_ID,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: trimmed,
          hitsPerPage,
          attributesToRetrieve: [
            "title",
            "name",
            "businessName",
            "category",
            "city",
            "address",
            "objectID",
          ],
          attributesToHighlight: ["title", "name", "category"],
        }),
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      const hits = data.hits || [];

      // Store in memory cache
      if (suggestionCache.size >= MAX_CACHE_SIZE) {
        const firstKey = suggestionCache.keys().next().value;
        suggestionCache.delete(firstKey);
      }
      suggestionCache.set(cacheKey, hits);

      return hits;
    } catch (error) {
      if (error.name === "AbortError") {
        return suggestionCache.get(cacheKey) || [];
      }
      console.error("Algolia suggestion error:", error);
      return [];
    }
  }

  static async _search(query, index) {
    if (!query.trim()) return [];
    
    const url = `https://${APP_ID}-dsn.algolia.net/1/indexes/${index}/query`;
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "X-Algolia-API-Key": API_KEY,
            "X-Algolia-Application-Id": APP_ID,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query,
            hitsPerPage: 10,
        }),
    });
    
    const data = await response.json();
    
    return data.hits || [];
  }
}
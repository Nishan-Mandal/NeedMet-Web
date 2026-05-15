const APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID;
const API_KEY = import.meta.env.VITE_ALGOLIA_SEARCH_KEY;

export class AlgoliaService {
  static async searchListings(query) {
    return this._search(query, "Listings");
  }

  static async searchCategories(query) {
    return this._search(query, "categories");
  }

  static async _search(query, index) {
    if (!query.trim()) return [];

    console.log(`[Api Call] algolia(${index}) -> start`);
    
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

    console.log(`[Api Call] algolia(${index}) -> end`);
    
    return data.hits || [];
  }
}
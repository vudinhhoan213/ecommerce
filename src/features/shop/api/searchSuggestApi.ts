import { mapSuggestResults } from "../../../mappers";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

// =============================================
// TYPES
// =============================================

export interface SuggestResult {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
}

// =============================================
// API FUNCTIONS
// =============================================

export const searchSuggestApi = {
  /** GET /products/search?q=&limit=8 — Gợi ý tìm kiếm */
  getSuggestions: async (keyword: string): Promise<SuggestResult[]> => {
    if (!keyword.trim()) return [];

    const response = await fetch(
      `${BASE_URL}/products/search?q=${encodeURIComponent(keyword)}&limit=8`,
    );

    if (!response.ok) {
      throw new Error(`Search suggest failed: ${response.status}`);
    }

    const data = await response.json();
    return mapSuggestResults(data.products);
  },
};

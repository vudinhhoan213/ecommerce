import type { SuggestResult } from "../features/shop/api/searchSuggestApi";

// =============================================
// MAPPERS
// =============================================

export const mapSuggestItem = (raw: SuggestResult): SuggestResult => ({
  id: raw.id,
  title: raw.title,
  thumbnail: raw.thumbnail,
  price: raw.price,
});

export const mapSuggestResults = (rawList: SuggestResult[]): SuggestResult[] =>
  rawList.map(mapSuggestItem);

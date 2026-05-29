import type { Product } from "../types";

// =============================================
// MAPPERS
// =============================================

export const mapProduct = (raw: Product): Product => ({
  id: raw.id,
  title: raw.title,
  description: raw.description,
  price: raw.price,
  rating: Math.min(Math.max(raw.rating, 0), 5),
  thumbnail: raw.thumbnail,
  images: Array.isArray(raw.images) ? raw.images : [],
  colors: raw.colors,
});

export const mapProducts = (rawList: Product[]): Product[] =>
  rawList.map(mapProduct);

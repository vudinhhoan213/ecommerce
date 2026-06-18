import type { BrandTheme, TextThemeConfig } from "./theme.types";

const text: TextThemeConfig = {
  heading:  { color: "#1a1a1a", fontSize: "22px", fontWeight: 700, lineHeight: 1.3 },
  title:    { color: "#1a1a1a", fontSize: "15px", fontWeight: 600, lineHeight: 1.4 },
  subtitle: { color: "#555",    fontSize: "14px", fontWeight: 400, lineHeight: 1.5 },
  body:     { color: "#333",    fontSize: "14px", fontWeight: 400, lineHeight: 1.6 },
  caption:  { color: "#888",    fontSize: "12px", fontWeight: 400, lineHeight: 1.4 },
  label:    { color: "#555",    fontSize: "12px", fontWeight: 500, lineHeight: 1.4, letterSpacing: "0.5px" },
  price:    { color: "#e53935", fontSize: "15px", fontWeight: 700, lineHeight: 1.3 },
  link:     { color: "#00bee6", fontSize: "14px", fontWeight: 500, lineHeight: 1.5 },
  error:    { color: "#e53935", fontSize: "13px", fontWeight: 400, lineHeight: 1.4 },
  success:  { color: "#43a047", fontSize: "13px", fontWeight: 400, lineHeight: 1.4 },
};

export const defaultTheme: BrandTheme = {
  brandId: "default",
  brandName: "Default",
  text,
};

export function createBrandTheme(
  brandId: string,
  brandName: string,
  colors: Partial<Record<keyof typeof text, string>>,
): BrandTheme {
  const brandText = { ...text };
  for (const [key, color] of Object.entries(colors)) {
    brandText[key as keyof typeof text] = { ...brandText[key as keyof typeof text], color };
  }
  return { brandId, brandName, text: brandText };
}

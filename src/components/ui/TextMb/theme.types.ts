export type TextVariant =
  | "heading"
  | "title"
  | "subtitle"
  | "body"
  | "caption"
  | "label"
  | "price"
  | "link"
  | "error"
  | "success";

export interface TextStyleConfig {
  color: string;
  fontSize?: string;
  fontWeight?: number | string;
  lineHeight?: string | number;
  letterSpacing?: string;
}

export type TextThemeConfig = Record<TextVariant, TextStyleConfig>;

export interface BrandTheme {
  brandId: string;
  brandName: string;
  text: TextThemeConfig;
}

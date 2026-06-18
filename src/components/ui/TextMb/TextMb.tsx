import React, { type JSX } from "react";
import type { TextVariant } from "./theme.types";
import { useTextMb } from "./TextMbProvider";

const TAG_MAP: Record<TextVariant, keyof JSX.IntrinsicElements> = {
  heading: "h2", title: "h4", subtitle: "p",
  body: "p", caption: "span", label: "span",
  price: "span", link: "span", error: "span", success: "span",
};

export interface TextMbProps {
  variant: TextVariant;
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
  color?: string;
  fontSize?: string;
  fontWeight?: number | string;
  className?: string;
  style?: React.CSSProperties;
  truncate?: boolean;
  maxLines?: number;
  onClick?: () => void;
}

const TextMb: React.FC<TextMbProps> = ({
  variant, as, children, color, fontSize, fontWeight,
  className, style, truncate, maxLines, onClick,
}) => {
  const { getStyle } = useTextMb();
  const t = getStyle(variant);

  const computed: React.CSSProperties = {
    color: color || t.color,
    fontSize: fontSize || t.fontSize,
    fontWeight: fontWeight || t.fontWeight,
    lineHeight: t.lineHeight,
    letterSpacing: t.letterSpacing,
    margin: 0,
    ...(truncate && { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }),
    ...(maxLines && !truncate && { overflow: "hidden", display: "-webkit-box", WebkitLineClamp: maxLines, WebkitBoxOrient: "vertical" }),
    ...(onClick && { cursor: "pointer" }),
    ...style,
  };

  const Tag = (as || TAG_MAP[variant]) as React.ElementType;

  return (
    <Tag className={className} style={computed} onClick={onClick}>
      {children}
    </Tag>
  );
};

export default TextMb;

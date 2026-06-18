import React, { createContext, useContext, useMemo } from "react";
import type { BrandTheme, TextVariant, TextStyleConfig } from "./theme.types";
import { defaultTheme } from "./defaultTheme";

interface TextMbContextValue {
  theme: BrandTheme;
  getStyle: (variant: TextVariant) => TextStyleConfig;
}

const TextMbContext = createContext<TextMbContextValue>({
  theme: defaultTheme,
  getStyle: (variant) => defaultTheme.text[variant],
});

interface TextMbProviderProps {
  theme?: BrandTheme;
  children: React.ReactNode;
}

export const TextMbProvider: React.FC<TextMbProviderProps> = ({
  theme = defaultTheme,
  children,
}) => {
  const contextValue = useMemo<TextMbContextValue>(
    () => ({
      theme,
      getStyle: (variant: TextVariant) =>
        theme.text[variant] || defaultTheme.text[variant],
    }),
    [theme],
  );

  return (
    <TextMbContext.Provider value={contextValue}>
      {children}
    </TextMbContext.Provider>
  );
};

export const useTextMb = () => useContext(TextMbContext);

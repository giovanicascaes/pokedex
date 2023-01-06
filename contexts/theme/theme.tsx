import { createContext, useContext } from "react";
import { ThemeContextValue } from "./theme.types";

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "`useTheme`: `ThemeContext` is `undefined`. Seems you forgot to wrap component within the `ThemeContext.Provider` component"
    );
  }

  return context;
}

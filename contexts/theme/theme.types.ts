export enum ThemeMode {
  Light = "light",
  Dark = "dark",
  System = "system",
}

export interface ThemeContextData {
  mode: ThemeMode;
}

export interface ThemeContextActions {
  setMode: (mode: ThemeMode) => void;
}

export type ThemeContextValue = [ThemeContextData, ThemeContextActions];

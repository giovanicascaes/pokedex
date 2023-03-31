import { ReactNode } from "react"

export enum ThemeMode {
  Light = "light",
  Dark = "dark",
  System = "system",
}

export interface ThemeModeContextData {
  themeMode: ThemeMode
  transitionClassNames: string
  isDark: boolean
}

export interface ThemeModeContextActions {
  setThemeMode: (mode: ThemeMode) => void
}

export type ThemeModeContextValue = [
  ThemeModeContextData,
  ThemeModeContextActions
]

export interface ThemeModeProviderProps {
  children: ReactNode
}

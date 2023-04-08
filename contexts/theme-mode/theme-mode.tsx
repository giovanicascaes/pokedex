import { useMedia } from "hooks"
import { useCallback, useEffect, useMemo, useState } from "react"
import { createContext } from "utils"
import {
  ThemeMode,
  ThemeModeContextActions,
  ThemeModeContextData,
  ThemeModeContextValue,
  ThemeModeProviderProps,
} from "./theme-mode.types"

export const THEME_MODE = "@@pokedex_theme-mode"

const [Provider, useContext] = createContext<ThemeModeContextValue>({
  hookName: "useThemeMode",
  providerName: "ThemeModeProvider",
})

export const useThemeMode = useContext

export function ThemeModeProvider({ children }: ThemeModeProviderProps) {
  const [themeMode, setThemeMode] = useState(ThemeMode.Light)
  const [transitionClassName, settransitionClassName] = useState("")

  const isMediaDark = useMedia("(prefers-color-scheme: dark)")

  const updateThemeMode = useCallback((mode: ThemeMode) => {
    setThemeMode(mode)
    // Adds transition to all elements in the application so that they can smoothly
    // transition to dark mode
    settransitionClassName("[&_*]:transition-all [&_*]:duration-[200ms]")
  }, [])

  useEffect(() => {
    if (transitionClassName) {
      // Removes transition classes after 300 ms
      const timeoutId = setTimeout(() => {
        settransitionClassName("")
      }, 300)

      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [transitionClassName])

  useEffect(() => {
    updateThemeMode(localStorage[THEME_MODE] ?? ThemeMode.Light)
  }, [updateThemeMode])

  const data: ThemeModeContextData = useMemo(
    () => ({
      themeMode,
      transitionClassName,
      isDark:
        themeMode === ThemeMode.Dark ||
        (themeMode === ThemeMode.System && isMediaDark),
    }),
    [isMediaDark, transitionClassName, themeMode]
  )

  const actions: ThemeModeContextActions = useMemo(
    () => ({
      setThemeMode(mode) {
        localStorage.setItem(THEME_MODE, mode)
        updateThemeMode(mode)

        setTimeout(() => {
          requestAnimationFrame(() => {
            if (
              mode === ThemeMode.Dark ||
              (mode === ThemeMode.System &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
            ) {
              document.documentElement.classList.add("dark")
            } else {
              document.documentElement.classList.remove("dark")
            }
          })
        }, 200)
      },
    }),
    [updateThemeMode]
  )

  return <Provider value={[data, actions]}>{children}</Provider>
}

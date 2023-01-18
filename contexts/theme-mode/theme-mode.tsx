import { useMedia } from "hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createContext } from "utils";
import {
  ThemeMode,
  ThemeModeContextActions,
  ThemeModeContextData,
  ThemeModeContextValue,
  ThemeModeProviderProps,
} from "./theme-mode.types";

export const THEME_MODE = "@@pokedex_theme-mode";

const [Provider, useContext] = createContext<ThemeModeContextValue>({
  hookName: "useThemeMode",
  providerName: "ThemeModeProvider",
});

export const useThemeMode = useContext;

export function ThemeModeProvider({ children }: ThemeModeProviderProps) {
  const [themeMode, setThemeMode] = useState(ThemeMode.Light);
  const [transitionClassNames, setTransitionClassNames] = useState("");

  const isMediaDark = useMedia("(prefers-color-scheme: dark)");

  const updateThemeMode = useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
    setTransitionClassNames("[&_*]:transition-all [&_*]:duration-[200ms]");
  }, []);

  useEffect(() => {
    if (transitionClassNames) {
      const timeoutId = setTimeout(() => {
        setTransitionClassNames("");
      }, 300);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [transitionClassNames]);

  useEffect(() => {
    updateThemeMode(localStorage[THEME_MODE] ?? ThemeMode.Light);
  }, [updateThemeMode]);

  const data: ThemeModeContextData = useMemo(
    () => ({
      themeMode,
      transitionClassNames,
      isDark:
        themeMode === ThemeMode.Dark ||
        (themeMode === ThemeMode.System && isMediaDark),
    }),
    [isMediaDark, transitionClassNames, themeMode]
  );

  const actions: ThemeModeContextActions = useMemo(
    () => ({
      setThemeMode(mode) {
        localStorage.setItem(THEME_MODE, mode);
        updateThemeMode(mode);

        setTimeout(() => {
          requestAnimationFrame(() => {
            if (
              mode === ThemeMode.Dark ||
              (mode === ThemeMode.System &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
            ) {
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
            }
          });
        }, 200);
      },
    }),
    [updateThemeMode]
  );

  return <Provider value={[data, actions]}>{children}</Provider>;
}

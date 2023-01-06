import { Inter } from "@next/font/google";
import { AppHeader, PageLoadingIndicator } from "components";
import {
  ThemeContext,
  ThemeContextActions,
  ThemeContextData,
  ThemeMode,
} from "contexts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { twJoin } from "tailwind-merge";
import { AppShellProps } from "./app-shell.types";

export const THEME_MODE_KEY = "@@pokedex_theme-mode";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function AppShell({ children }: AppShellProps) {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isSsrReady, setIsSsrReady] = useState(false);
  const [themeMode, setThemeMode] = useState(ThemeMode.Light);
  const [isTransitioningTheme, setIsTransitioningTheme] = useState(false);
  const headerRefCallback = useCallback((node: HTMLElement) => {
    if (node) {
      setHeaderHeight(node.getBoundingClientRect().height);
    }
  }, []);

  const updateThemeMode = useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
    setIsTransitioningTheme(true);
  }, []);

  useEffect(() => {
    if (isTransitioningTheme) {
      const timeoutId = setTimeout(() => {
        setIsTransitioningTheme(false);
      }, 300);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isTransitioningTheme]);

  useEffect(() => {
    updateThemeMode(localStorage[THEME_MODE_KEY] ?? ThemeMode.Light);
  }, [updateThemeMode]);

  useEffect(() => {
    setIsSsrReady(true);
  }, []);

  const data: ThemeContextData = useMemo(
    () => ({ mode: themeMode }),
    [themeMode]
  );

  const actions: ThemeContextActions = useMemo(
    () => ({
      setMode(mode) {
        localStorage.setItem(THEME_MODE_KEY, mode);
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

  if (isSsrReady) {
    return (
      <ThemeContext.Provider value={[data, actions]}>
        <main
          className={twJoin(
            inter.variable,
            "font-sans min-h-screen",
            isTransitioningTheme && "[&_*}:transition-colors [&_*]:duration-300"
          )}
        >
          <PageLoadingIndicator />
          <AppHeader
            className="fixed top-0 left-0 z-40"
            ref={headerRefCallback}
          />
          <div
            className="bg-slate-50 dark:bg-slate-800 min-h-screen"
            style={{ paddingTop: headerHeight }}
          >
            {children}
          </div>
        </main>
      </ThemeContext.Provider>
    );
  }

  return null;
}

import { ThemeMode, THEME_MODE } from "contexts";
import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script id="load-theme" strategy="beforeInteractive">
          {`
            const matchMediaDarkColorScheme = window.matchMedia(
              "(prefers-color-scheme: dark)"
            );
            const isThemeModeSystem = () =>
              !("${THEME_MODE}" in localStorage) ||
              localStorage["${THEME_MODE}"] === "${ThemeMode.System}";
            
            if (
              localStorage["${THEME_MODE}"] === "${ThemeMode.Dark}" ||
              (isThemeModeSystem() && matchMediaDarkColorScheme.matches)
            ) {
              document.documentElement.classList.add("dark");
            }
            
            matchMediaDarkColorScheme.addEventListener(
              "change",
              ({ matches: matchesDarkColorScheme }) => {
                if (!isThemeModeSystem()) {
                  return;
                }
            
                if (matchesDarkColorScheme) {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              }
            );                      
          `}
        </Script>
      </body>
    </Html>
  );
}

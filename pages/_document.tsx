import { THEME_MODE_KEY } from "components";
import { ThemeMode } from "contexts";
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
            if (
              localStorage["${THEME_MODE_KEY}"] === "${ThemeMode.Dark}" ||
              ((!("${THEME_MODE_KEY}" in localStorage) ||
                localStorage["${THEME_MODE_KEY}"] === "${ThemeMode.System}") &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
            ) {
              document.documentElement.classList.add("dark");
            }
          `}
        </Script>
      </body>
    </Html>
  );
}

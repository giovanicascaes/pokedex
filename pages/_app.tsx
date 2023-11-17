import { Inter } from "@next/font/google"
import { AppShell } from "components"
import { SHELL_LAYOUT_CONTAINER_ELEMENT_ID } from "lib"
import type { AppProps } from "next/app"
import "styles/globals.css"
import { twMerge } from "tailwind-merge"
import { NextPageWithConfig } from "types"

type AppPropsWithConfig = AppProps & {
  Component: NextPageWithConfig
}

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export default function App({ Component, pageProps }: AppPropsWithConfig) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <div
      id={SHELL_LAYOUT_CONTAINER_ELEMENT_ID}
      className={twMerge(
        inter.variable,
        "font-sans bg-slate-50 dark:bg-slate-800 h-full"
      )}
    >
      <AppShell scrollConfig={Component.scrollConfig}>
        {getLayout(<Component {...pageProps} />)}
      </AppShell>
    </div>
  )
}

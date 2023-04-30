import { Inter } from "@next/font/google"
import { AppShell } from "components"
import { PageProvider, ThemeModeProvider } from "contexts"
import { SHELL_LAYOUT_CONTAINER_ELEMENT_ID } from "lib"
import { NextPage } from "next"
import type { AppProps } from "next/app"
import { ReactNode } from "react"
import "styles/globals.css"
import { twMerge } from "tailwind-merge"

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactNode) => ReactNode
  enableScrollControl?: boolean
  restoreScrollForPages?: string[]
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page) => <AppShell>{page}</AppShell>)

  return (
    <div
      id={SHELL_LAYOUT_CONTAINER_ELEMENT_ID}
      className={twMerge(
        inter.variable,
        "font-sans bg-slate-50 dark:bg-slate-800 h-full"
      )}
    >
      <ThemeModeProvider>
        <PageProvider>{getLayout(<Component {...pageProps} />)}</PageProvider>
      </ThemeModeProvider>
    </div>
  )
}

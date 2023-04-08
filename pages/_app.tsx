import { AppShell } from "components"
import { ThemeModeProvider } from "contexts"
import { NextPage } from "next"
import type { AppProps } from "next/app"
import { ReactNode } from "react"
import "../styles/globals.css"

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactNode) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <ThemeModeProvider>
      <AppShell>{getLayout(<Component {...pageProps} />)}</AppShell>
    </ThemeModeProvider>
  )
}

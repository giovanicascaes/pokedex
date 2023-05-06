import { AppHeader, PageLoadingIndicator } from "components"
import { PokemonProvider } from "contexts"
import { AppLayoutProps } from "./app-layout.types"

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <PageLoadingIndicator />
      <PokemonProvider>
        <AppHeader className="sticky top-0 z-10 flex-shrink-0" />
        <main>{children}</main>
      </PokemonProvider>
    </>
  )
}

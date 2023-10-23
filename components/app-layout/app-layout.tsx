import { AppHeader, PageLoadingIndicator } from "components"
import { PokemonProvider } from "contexts"
import { AppLayoutProps } from "./app-layout.types"

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <PageLoadingIndicator />
      <PokemonProvider>
        <AppHeader />
        <main className="h-full">{children}</main>
      </PokemonProvider>
    </>
  )
}

import { AppShellControlledScroll, PokemonList } from "components"
import { usePage, usePokemon, useScrollControl } from "contexts"
import { useIsoMorphicEffect } from "hooks"
import { ReactNode, useEffect } from "react"

export default function Pokedex() {
  const [{ pokedex }, { removePokemonFromPokedex }] = usePokemon()
  const [, { setUpBreadcrumb }] = usePage()
  const [{ isScrollVisited }, { onPageLoadComplete }] = useScrollControl()

  useIsoMorphicEffect(() => {
    return setUpBreadcrumb([{ label: "Pokedéx" }])
  }, [setUpBreadcrumb])

  useEffect(() => {
    if (!pokedex.length) {
      onPageLoadComplete()
    }
  }, [onPageLoadComplete, pokedex.length])

  if (pokedex.length) {
    return (
      <div className="px-14 pt-4 h-full pb-8">
        <PokemonList
          pokemons={pokedex}
          skipInitialAnimation={isScrollVisited}
          onRemoveFromPokedex={removePokemonFromPokedex}
          onLoad={onPageLoadComplete}
          className="mx-auto"
        />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-full">
      <span className="text-sm text-slate-500 dark:text-slate-400">
        No pokémon has been captured
      </span>
    </div>
  )
}

Pokedex.getLayout = function getLayout(page: ReactNode) {
  return (
    <AppShellControlledScroll preserveScroll={["/pokemon/[key]"]}>
      {page}
    </AppShellControlledScroll>
  )
}

export async function getServerSideProps() {
  return {
    props: {},
  }
}

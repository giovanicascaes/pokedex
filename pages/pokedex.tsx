import { PokemonList } from "components"
import { usePage, usePokemon, useScrollControl } from "contexts"
import { useIsoMorphicEffect } from "hooks"
import { useEffect } from "react"

export default function Pokedex() {
  const [{ pokedex }, { removePokemonFromPokedex }] = usePokemon()
  const [, { setUpBreadcrumb }] = usePage()
  const [{ isPreviousScrollSaved }, { onPageLoadComplete }] = useScrollControl()

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
      <div className="flex flex-col px-14 pt-4 pb-8">
        <PokemonList
          pokemons={pokedex}
          skipFirstItemsAnimation={isPreviousScrollSaved}
          hideBeforeRelease
          onRelease={removePokemonFromPokedex}
          onLoad={onPageLoadComplete}
          className="mx-auto"
        />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-full">
      <span className="text-sm text-slate-500 dark:text-slate-400">
        No pokémon has been captured
      </span>
    </div>
  )
}

Pokedex.restoreScrollOnNavigatingFrom = ["/pokemon/[key]"]

export async function getServerSideProps() {
  return {
    props: {},
  }
}

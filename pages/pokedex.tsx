import { PokemonList } from "components"
import { usePage, usePokemon, useScrollControl } from "contexts"
import { useIsoMorphicEffect } from "hooks"
import { useEffect } from "react"
import { NextPageWithConfig } from "types"

const Pokedex: NextPageWithConfig = () => {
  const [{ pokedex }, { removePokemonFromPokedex }] = usePokemon()
  const [, { setUpBreadcrumb }] = usePage()
  const [{ shouldRestoreScroll }, { onPageLoadComplete }] = useScrollControl()

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
          immediateAnimations={shouldRestoreScroll}
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

Pokedex.enableScrollControl = {
  enabled: true,
  childrenPaths: ["/pokemon/[key]"],
  waitForPageToLoad: true,
}

export async function getServerSideProps() {
  return {
    props: {},
  }
}

export default Pokedex

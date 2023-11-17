import { PokemonList } from "components"
import { usePage, usePokemon } from "contexts"
import { useIsoMorphicEffect } from "hooks"
import { useEffect } from "react"
import { NextPageWithConfig } from "types"

const Pokedex: NextPageWithConfig = () => {
  const [{ pokedex }, { removeFromPokedex }] = usePokemon()
  const [, { updateBreadcrumb }] = usePage()
  const [, { onPageLoadComplete }] = usePage()

  useIsoMorphicEffect(() => {
    return updateBreadcrumb([{ label: "Pokedéx" }])
  }, [updateBreadcrumb])

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
          onRelease={removeFromPokedex}
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

Pokedex.scrollConfig = {
  restoreScrollIfComingFrom: ["/pokemon/[key]"],
}

export async function getServerSideProps() {
  return {
    props: {},
  }
}

export default Pokedex

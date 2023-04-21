import { PokemonList } from "components"
import { usePages, usePokemonView } from "contexts"
import { useCallback } from "react"

export default function Pokedex() {
  const [{ pokedex }, { removePokemonFromPokedex }] = usePokemonView()
  const [{ isScrollDirty }, { setLoadingPage }] = usePages()

  const onViewReady = useCallback(() => {
    setLoadingPage(null)
  }, [setLoadingPage])

  if (pokedex.length) {
    return (
      <div className="px-14 pt-4 h-full pb-8">
        <PokemonList
          pokemons={pokedex}
          skipInitialAnimation={isScrollDirty}
          onRemoveFromPokedex={removePokemonFromPokedex}
          onReady={onViewReady}
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

export async function getServerSideProps() {
  return {
    props: {},
  }
}

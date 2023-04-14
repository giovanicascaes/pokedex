import { PokemonList } from "components"
import { usePages, usePokemonView } from "contexts"
import { useCallback } from "react"

export default function Pokedex() {
  const [{ pokedex }, { removePokemonFromPokedex }] = usePokemonView()
  const [{ isScrollDirty }, { setLoadingPage }] = usePages()

  const onViewReady = useCallback(() => {
    setLoadingPage(null)
  }, [setLoadingPage])

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

export async function getServerSideProps() {
  return {
    props: {},
  }
}

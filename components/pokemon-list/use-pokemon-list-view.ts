import { PokemonSpeciesPokedex } from "contexts"
import { usePrevious } from "hooks"
import { useCallback, useMemo, useRef, useState } from "react"
import { UsePokemonListViewArgs } from "./pokemon-list.types"

const LIST_TRAIL = 100

export default function usePokemonListView({
  onAddToPokedex,
  onRemoveFromPokedex,
  pokemons,
  listTrailLength = LIST_TRAIL,
  onReady,
  skipInitialAnimation = false,
}: UsePokemonListViewArgs) {
  const animatedPokemons = useRef<Set<number>>(new Set())
  const prevPokemons = usePrevious(pokemons)
  const haveNewPokemonsBeenLoaded = useMemo(
    () => prevPokemons && prevPokemons.length !== pokemons.length,
    [pokemons.length, prevPokemons]
  )
  const [animate, setAnimate] = useState(!skipInitialAnimation)

  const handleOnPokemonCatchReleaseFinish = useCallback(
    (pokemon: PokemonSpeciesPokedex) => {
      if (pokemon.isOnPokedex) {
        onRemoveFromPokedex(pokemon.id)
      } else {
        onAddToPokedex(pokemon)
      }
    },
    [onAddToPokedex, onRemoveFromPokedex]
  )

  const transitionProps = useMemo(
    () => ({
      delay: (key: string) => {
        if (!animate) return 0

        return (
          pokemons
            .filter(({ id }) =>
              Array.from(animatedPokemons.current.values()).every(
                (renderedId) => renderedId !== id
              )
            )
            .findIndex(({ id }) => id === (key as unknown as number)) *
          listTrailLength
        )
      },
      immediate: !animate,
      onRest: (_result: any, _ctrl: any, { id }: PokemonSpeciesPokedex) => {
        animatedPokemons.current.add(id)

        if (
          !haveNewPokemonsBeenLoaded &&
          animatedPokemons.current.size === pokemons.length
        ) {
          onReady?.()
          setAnimate(true)
        }
      },
    }),
    [animate, listTrailLength, onReady, pokemons, haveNewPokemonsBeenLoaded]
  )

  return {
    handleOnPokemonCatchReleaseFinish,
    transitionProps,
  }
}

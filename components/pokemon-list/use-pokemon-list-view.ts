import { PokemonSpeciesPokedex } from "contexts"
import { useCallback, useEffect, useRef, useState } from "react"
import PokemonListItemAnimationController from "./pokemon-list-item-animation-controller"
import { UsePokemonListViewArgs } from "./pokemon-list.types"

export default function usePokemonListView({
  pokemons,
  skipFirstPageAnimations = false,
  removeOnRelease = false,
  animationProperties,
  onCatch,
  onRelease,
  onLoad,
}: UsePokemonListViewArgs) {
  const animationControllerRef = useRef(
    new PokemonListItemAnimationController(animationProperties)
  )
  const [shouldAnimateFirstPokemons, setShouldAnimateFirstPokemons] = useState(
    !skipFirstPageAnimations
  )

  const handleOnCatchReleaseFinish = useCallback(
    async (pokemon: PokemonSpeciesPokedex) => {
      if (pokemon.isOnPokedex) {
        const { id } = pokemon

        if (removeOnRelease) {
          await animationControllerRef.current.leave(id)
        }

        onRelease(id)
      } else {
        onCatch?.(pokemon)
      }
    },
    [onCatch, onRelease, removeOnRelease]
  )

  const handleOnIntersectionChange = useCallback(
    (id: number, isIntersecting: boolean) => {
      if (!shouldAnimateFirstPokemons) return

      if (isIntersecting) {
        animationControllerRef.current.queue(id)
      } else {
        animationControllerRef.current.skip(id)
      }
    },
    [shouldAnimateFirstPokemons]
  )

  const getStyles = useCallback(
    (id: number) => animationControllerRef.current.getStyles(id),
    []
  )

  useEffect(() => {
    animationControllerRef.current.setPokemons(pokemons)
  }, [pokemons])

  useEffect(() => {
    if (!shouldAnimateFirstPokemons) {
      animationControllerRef.current.skipAll()
      setShouldAnimateFirstPokemons(true)
    }

    onLoad?.()
  }, [shouldAnimateFirstPokemons, onLoad])

  useEffect(
    () => () => {
      animationControllerRef.current.cancel()
    },
    []
  )

  return {
    handleOnCatchReleaseFinish,
    handleOnIntersectionChange,
    getStyles,
  }
}

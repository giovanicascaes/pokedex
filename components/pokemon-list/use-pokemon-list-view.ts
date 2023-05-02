import { PokemonSpeciesPokedex } from "contexts"
import { useCallback, useEffect, useRef, useState } from "react"
import { UsePokemonListViewArgs } from "./pokemon-list.types"
import PokemonListItemAnimationController from "./pokemon-list-item-animation-controller"

export default function usePokemonListView({
  onAddToPokedex,
  onRemoveFromPokedex,
  pokemons,
  onLoad,
  skipInitialAnimation = false,
  animationProperties,
}: UsePokemonListViewArgs) {
  const animationControllerRef = useRef(
    new PokemonListItemAnimationController(animationProperties)
  )
  const [isInitialAnimationDone, setIsInitialAnimationDone] = useState(
    !skipInitialAnimation
  )

  const handleOnCatchReleaseFinish = useCallback(
    (pokemon: PokemonSpeciesPokedex) => {
      if (pokemon.isOnPokedex) {
        const { id } = pokemon

        animationControllerRef.current.leave(id).then(() => {
          onRemoveFromPokedex(id)
        })
      } else {
        onAddToPokedex?.(pokemon)
      }
    },
    [onAddToPokedex, onRemoveFromPokedex]
  )

  const handleOnIntersectionChange = useCallback(
    (id: number, isIntersecting: boolean) => {
      if (!isInitialAnimationDone) return

      if (isIntersecting) {
        animationControllerRef.current.queue(id)
      } else {
        animationControllerRef.current.skip(id)
      }
    },
    [isInitialAnimationDone]
  )

  const getStyles = useCallback(
    (id: number) => animationControllerRef.current.getStyles(id),
    []
  )

  useEffect(() => {
    animationControllerRef.current.setPokemons(pokemons)
  }, [pokemons])

  useEffect(() => {
    if (!isInitialAnimationDone) {
      animationControllerRef.current.skipAll()
      setIsInitialAnimationDone(true)
    }

    onLoad?.()
  }, [isInitialAnimationDone, onLoad])

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

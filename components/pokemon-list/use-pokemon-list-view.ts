import { PokemonSpeciesPokedex } from "contexts"
import { useCallback, useEffect, useRef, useState } from "react"
import { UsePokemonListViewArgs } from "./pokemon-list.types"
import PokemonListItemAnimationController from "./PokemonListItemAnimationController"

export default function usePokemonListView({
  onAddToPokedex,
  onRemoveFromPokedex,
  pokemons,
  onLoad,
  skipInitialAnimation = false,
  animationProperties,
}: UsePokemonListViewArgs) {
  const animationController = useRef(
    new PokemonListItemAnimationController(animationProperties)
  )
  const [isInitialAnimationDone, setIsInitialAnimationDone] = useState(
    !skipInitialAnimation
  )

  const handleOnCatchReleaseFinish = useCallback(
    (pokemon: PokemonSpeciesPokedex) => {
      if (pokemon.isOnPokedex) {
        const { id } = pokemon

        animationController.current.leave(id).then(() => {
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
        animationController.current.queue(id)
      } else {
        animationController.current.skip(id)
      }
    },
    [isInitialAnimationDone]
  )

  const getStyles = useCallback(
    (id: number) => animationController.current.getStyles(id),
    []
  )

  useEffect(() => {
    animationController.current.setPokemons(pokemons)
  }, [pokemons])

  useEffect(() => {
    if (!isInitialAnimationDone) {
      animationController.current.skipAll()
      setIsInitialAnimationDone(true)
    }

    onLoad?.()
  }, [isInitialAnimationDone, onLoad])

  useEffect(
    () => () => {
      animationController.current.cancel()
    },
    []
  )

  return {
    handleOnCatchReleaseFinish,
    handleOnIntersectionChange,
    getStyles,
  }
}

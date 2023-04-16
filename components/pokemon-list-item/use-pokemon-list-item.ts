import { PokemonCatchReleaseAnimationState } from "components/pokemon-catch-release-animation"
import { useCallback, useMemo, useState } from "react"
import { UsePokemonListItemArgs } from "./pokemon-list-item.types"

export default function usePokemonListItem({
  onCatchReleaseFinish,
  isOnPokedex,
}: UsePokemonListItemArgs) {
  const [isCatchingOrReleasing, setIsCatchingOrReleasing] = useState(false)

  const handleCatchReleaseStart = useCallback(() => {
    setIsCatchingOrReleasing(true)
  }, [])

  const handleCatchReleaseFinish = useCallback(() => {
    setIsCatchingOrReleasing(false)
    onCatchReleaseFinish?.()
  }, [onCatchReleaseFinish])

  const catchReleaseState = useMemo<PokemonCatchReleaseAnimationState>(() => {
    if (!isCatchingOrReleasing) return "idle"

    if (isOnPokedex) return "releasing"

    return "catching"
  }, [isCatchingOrReleasing, isOnPokedex])

  return {
    isCatchingOrReleasing,
    catchReleaseState,
    handleCatchReleaseStart,
    handleCatchReleaseFinish,
  }
}

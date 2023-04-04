import { useCallback, useState } from "react"
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

  return {
    isCatchingOrReleasing,
    isCaughtOrBeingCaught: isCatchingOrReleasing !== isOnPokedex,
    handleCatchReleaseStart,
    handleCatchReleaseFinish,
  }
}

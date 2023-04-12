import { useIntersectionObserver, usePrevious } from "hooks"
import { useEffect } from "react"
import { UseIntersectionObserverPokemonListItemArgs } from "./intersection-observer-pokemon-list-item.types"

export default function useIntersectionObserverPokemonListItem({
  onIntersectionChange,
  root,
  threshold,
}: UseIntersectionObserverPokemonListItemArgs) {
  const [intersectionObserverRef, isIntersecting] = useIntersectionObserver({
    threshold,
    root,
    rootMargin: "20%",
    disconnectOnceNoLongerVisible: true,
  })
  const prevIsIntersecting = usePrevious(isIntersecting)

  useEffect(() => {
    if (
      prevIsIntersecting !== undefined &&
      prevIsIntersecting !== isIntersecting
    ) {
      onIntersectionChange?.(isIntersecting)
    }
  }, [isIntersecting, onIntersectionChange, prevIsIntersecting])

  return intersectionObserverRef
}

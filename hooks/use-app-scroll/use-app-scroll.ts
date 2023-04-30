import { useIsoMorphicEffect, usePrevious, useScrollTop } from "hooks"
import { useRouter } from "next/router"
import { UIEvent, useCallback, useEffect, useState } from "react"
import usePreviousScroll from "./use-previous-scroll"

export default function useAppScroll(
  isEnabled: boolean,
  isContentLoaded: boolean,
  isPageTransitionRunning: boolean
) {
  const { pathname: currentPath } = useRouter()
  const prevPath = usePrevious(currentPath)
  const [scrollContainer, scrollContainerRef] = useState<HTMLElement | null>(
    null
  )
  const [isScrollSettled, setIsScrollSettled] = useState(true)
  const [isScrollTrackEnabled, setIsScrollTrackEnabled] = useState(true)
  const [currentScrollTop, { onScroll }] = useScrollTop(!isScrollTrackEnabled)
  const previousScrollTop = usePreviousScroll(currentScrollTop)

  const isScrollDirty = previousScrollTop > 0

  const handleOnScroll = useCallback(
    (event: UIEvent) => {
      const { scrollTop: nextScrollTop } = event.currentTarget

      if (!isScrollSettled && nextScrollTop === previousScrollTop) {
        setIsScrollSettled(true)
      }

      onScroll(event)
    },
    [onScroll, isScrollSettled, previousScrollTop]
  )

  useEffect(() => {
    if (prevPath) {
      setIsScrollTrackEnabled(false)
      setIsScrollSettled(false)
    }
  }, [currentPath, prevPath])

  useIsoMorphicEffect(() => {
    if (isPageTransitionRunning || isScrollSettled) {
      return
    }

    if (currentPath === "/" || currentPath === "/pokedex") {
      if (!isContentLoaded) return

      if (previousScrollTop === scrollContainer!.scrollTop) {
        setIsScrollSettled(true)
      } else {
        scrollContainer!.scrollTo({
          top: previousScrollTop,
        })
      }

      setIsScrollTrackEnabled(true)
    } else if (!isScrollTrackEnabled) {
      scrollContainer!.scrollTo({
        top: 0,
      })
      setIsScrollSettled(true)
    }
  }, [
    currentPath,
    currentScrollTop,
    isPageTransitionRunning,
    isScrollSettled,
    isScrollTrackEnabled,
    isContentLoaded,
    scrollContainer,
    previousScrollTop,
  ])

  return {
    ref: scrollContainerRef,
    onScroll: handleOnScroll,
    isScrollSettled,
    isScrollDirty,
  }
}

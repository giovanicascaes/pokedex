import { useIsoMorphicEffect, usePrevious, useScrollTop } from "hooks"
import { useRouter } from "next/router"
import { UIEvent, useCallback, useEffect, useState } from "react"
import usePreviousScroll from "./use-previous-scroll"

export default function useControlledScroll(
  enable: boolean,
  isPageLoaded: boolean,
  isPageTransitionRunning: boolean
) {
  const { pathname: currentPath } = useRouter()
  const prevPath = usePrevious(currentPath)
  const [scrollContainer, scrollContainerRef] = useState<HTMLElement | null>(
    null
  )
  const [isScrollSettled, setIsScrollSettled] = useState(true)
  const [currentScrollTop, { onScroll }] = useScrollTop(!enable)
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
      setIsScrollSettled(false)
    }
  }, [currentPath, prevPath])

  useIsoMorphicEffect(() => {
    if (isPageTransitionRunning || isScrollSettled) {
      return
    }

    if (enable) {
      if (!isPageLoaded) return

      if (previousScrollTop === scrollContainer!.scrollTop) {
        setIsScrollSettled(true)
      } else {
        scrollContainer!.scrollTo({
          top: previousScrollTop,
        })
      }
    } else {
      scrollContainer!.scrollTo({
        top: 0,
      })
      setIsScrollSettled(true)
    }
  }, [
    enable,
    isPageLoaded,
    isPageTransitionRunning,
    isScrollSettled,
    previousScrollTop,
    scrollContainer,
  ])

  return {
    ref: scrollContainerRef,
    onScroll: handleOnScroll,
    isScrollSettled,
    isScrollDirty,
  }
}

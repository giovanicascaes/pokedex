import { useIsoMorphicEffect, usePrevious, useScrollTop } from "hooks"
import { useRouter } from "next/router"
import { UIEvent, useCallback, useEffect, useState } from "react"
import useAppScrollPath from "./use-app-scroll-path"

export default function useAppScroll(
  loadingPage: string | null,
  disableScrollRestore: boolean = false
) {
  const { pathname: currentPath } = useRouter()
  const prevPath = usePrevious(currentPath)
  const [scrollContainer, scrollContainerRef] = useState<Element | null>(null)
  const [isScrollReady, setIsScrollReady] = useState(true)
  const [isScrollTrackEnabled, setIsScrollTrackEnabled] = useState(true)
  const [scrollTop, setScrollTop] = useAppScrollPath()
  const [currentScrollTop, { onScroll }] = useScrollTop(!isScrollTrackEnabled)

  const isScrollDirty = scrollTop > 0

  const handleOnScroll = useCallback(
    (event: UIEvent) => {
      const { scrollTop: nextScrollTop } = event.currentTarget

      requestAnimationFrame(() => {
        if (!isScrollReady && nextScrollTop === scrollTop) {
          setIsScrollReady(true)
        }
      })

      onScroll(event)
    },
    [onScroll, isScrollReady, scrollTop]
  )

  useEffect(() => {
    if (isScrollReady && isScrollTrackEnabled && prevPath === currentPath) {
      setScrollTop(currentScrollTop)
    }
  }, [
    currentPath,
    currentScrollTop,
    isScrollReady,
    isScrollTrackEnabled,
    prevPath,
    setScrollTop,
  ])

  useEffect(() => {
    if (prevPath && prevPath !== currentPath) {
      setIsScrollTrackEnabled(false)
      setIsScrollReady(false)
    }
  }, [currentPath, prevPath])

  useIsoMorphicEffect(() => {
    if (disableScrollRestore || isScrollReady) {
      return
    }

    if (currentPath === "/") {
      if (loadingPage) return

      scrollContainer!.scrollTo({
        top: scrollTop,
      })

      if (scrollTop === currentScrollTop) {
        setIsScrollReady(true)
      }

      setIsScrollTrackEnabled(true)
    } else if (!isScrollTrackEnabled) {
      scrollContainer!.scrollTo({
        top: 0,
      })
      setIsScrollReady(true)
    }
  }, [
    currentPath,
    currentScrollTop,
    disableScrollRestore,
    isScrollReady,
    isScrollTrackEnabled,
    loadingPage,
    scrollContainer,
    scrollTop,
  ])

  return {
    ref: scrollContainerRef,
    onScroll: handleOnScroll,
    isScrollReady,
    isScrollDirty,
  }
}

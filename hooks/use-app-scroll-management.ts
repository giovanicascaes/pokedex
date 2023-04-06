import { usePokemonView } from "contexts"
import { useRouter } from "next/router"
import { UIEvent, useCallback, useEffect, useState } from "react"
import { useIsoMorphicEffect } from "./use-iso-morphic-effect"
import usePrevious from "./use-previous"
import useScrollTop from "./use-scroll-top"

export default function useAppScrollManagement(
  isSettingUpPage: string | null,
  disableScrollRestore: boolean = false
) {
  const [isScrollTrackEnabled, setIsScrollTrackEnabled] = useState(true)
  const [isScrollReady, setIsScrollReady] = useState(true)
  const [isChangingPath, setIsChangingPath] = useState(false)
  const [scrollContainer, scrollContainerRef] = useState<Element | null>(null)
  const { asPath: currentPath } = useRouter()
  const prevPath = usePrevious(currentPath)
  const [, { dirtyScroll }] = usePokemonView()
  const [scrollTop, { onScroll }] = useScrollTop(!isScrollTrackEnabled)

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
    [isScrollReady, onScroll, scrollTop]
  )

  useEffect(() => {
    if (scrollTop > 0) {
      dirtyScroll()
    }
  }, [dirtyScroll, scrollTop])

  useEffect(() => {
    if (prevPath && prevPath !== currentPath) {
      setIsChangingPath(true)
      setIsScrollReady(false)
    }
  }, [currentPath, prevPath])

  useIsoMorphicEffect(() => {
    if (disableScrollRestore || !isChangingPath) {
      return
    }

    if (currentPath === "/") {
      if (isSettingUpPage) return

      scrollContainer!.scrollTo({
        top: scrollTop,
      })
      setIsScrollTrackEnabled(true)
    } else if (!isScrollTrackEnabled) {
      scrollContainer!.scrollTo({
        top: 0,
      })
      setIsScrollReady(true)
    } else {
      setIsScrollTrackEnabled(false)

      return
    }

    setIsChangingPath(false)
  }, [
    currentPath,
    disableScrollRestore,
    isChangingPath,
    isScrollTrackEnabled,
    isSettingUpPage,
    scrollTop,
  ])

  return {
    ref: scrollContainerRef,
    onScroll: handleOnScroll,
    isScrollReady,
  }
}

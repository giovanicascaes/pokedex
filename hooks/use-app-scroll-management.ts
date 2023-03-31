import { usePokemonView } from "contexts"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import useIsomorphicEffect from "./use-isomorphic-effect"
import usePrevious from "./use-previous"
import useScrollTop from "./use-scroll-top"

export default function useAppScrollManagement(
  disableScrollRestore: boolean = false
) {
  const [disableScrollTrack, setDisableScrollTrack] = useState(false)
  const [pathHasChanged, setPathHasChanged] = useState(false)
  const [scrollContainer, scrollContainerRef] = useState<Element | null>(null)
  const { asPath: currentPath } = useRouter()
  const prevPath = usePrevious(currentPath)
  const [, { dirtyScroll }] = usePokemonView()
  const [scrollTop, { onScroll }] = useScrollTop(disableScrollTrack)

  useEffect(() => {
    if (scrollTop > 0) {
      dirtyScroll()
    }
  }, [dirtyScroll, scrollTop])

  useEffect(() => {
    if (prevPath && prevPath !== currentPath) {
      setPathHasChanged(true)
    }
  }, [currentPath, prevPath])

  useIsomorphicEffect(() => {
    if (disableScrollRestore || !pathHasChanged) {
      return
    }

    if (currentPath === "/") {
      scrollContainer!.scrollTo({
        top: scrollTop,
      })
      setDisableScrollTrack(false)
    } else if (disableScrollTrack) {
      scrollContainer!.scrollTo({
        top: 0,
      })
    } else {
      setDisableScrollTrack(true)

      return
    }

    setPathHasChanged(false)
  }, [
    currentPath,
    disableScrollRestore,
    disableScrollTrack,
    pathHasChanged,
    scrollContainer,
    scrollTop,
  ])

  return {
    ref: scrollContainerRef,
    onScroll,
  }
}

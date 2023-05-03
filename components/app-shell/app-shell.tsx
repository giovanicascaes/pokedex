import {
  AppLayout,
  AppScroll,
  PageTransition,
  PageTransitionElement,
} from "components"
import {
  ScrollControlContextActions,
  ScrollControlContextData,
  ScrollControlProvider,
} from "contexts"
import { useRouterEvent } from "hooks"
import { useRouter } from "next/router"
import { UIEvent, useCallback, useEffect, useRef, useState } from "react"
import { AppShellProps } from "./app-shell.types"
import ScrollController from "./scroll-controller"

export default function AppShell({
  enableScrollControl = true,
  restoreScrollOnNavigatingFrom = [],
  children,
}: AppShellProps) {
  const [isScrollVisited, setIsScrollVisited] = useState(false)
  const pageTransitionRef = useRef<PageTransitionElement>(null)
  const { pathname: currentPath } = useRouter()
  const scrollControllerRef = useRef(
    new ScrollController(currentPath, restoreScrollOnNavigatingFrom)
  )

  const scrollRef = useCallback((scrollEl: HTMLElement | null) => {
    if (scrollEl) scrollControllerRef.current.scrollEl = scrollEl
  }, [])

  const handleOnScroll = useCallback((event: UIEvent) => {
    const { scrollTop: nextScrollTop } = event.currentTarget

    scrollControllerRef.current.scrollTop = nextScrollTop
  }, [])

  useRouterEvent("beforeHistoryChange", () => {
    scrollControllerRef.current.pushHistoryEntry(currentPath)
  })

  useRouterEvent("routeChangeStart", () => {
    scrollControllerRef.current.saveCurrentPathState()
  })

  useEffect(() => {
    scrollControllerRef.current.currentPath = currentPath
    setIsScrollVisited(scrollControllerRef.current.isVisited)
  }, [currentPath])

  useEffect(() => {
    if (enableScrollControl) {
      scrollControllerRef.current.enable()
    } else {
      scrollControllerRef.current.disable()
    }
  }, [enableScrollControl])

  useEffect(() => {
    scrollControllerRef.current.restoreScrollOnNavigatingFrom =
      restoreScrollOnNavigatingFrom
  }, [restoreScrollOnNavigatingFrom])

  useEffect(() => {
    return () => {
      // Not a React node
      // eslint-disable-next-line react-hooks/exhaustive-deps
      scrollControllerRef.current.removeAllListeners()
    }
  }, [])

  const onPageTransitionStart = useCallback(() => {
    scrollControllerRef.current.addScrollListener("rest", () => {
      pageTransitionRef.current!.resumeFade()
    })
    scrollControllerRef.current.addScrollListener("reset", () => {
      setIsScrollVisited(false)
    })
    scrollControllerRef.current.isSwitchingPage = true
  }, [])

  const onPageTransitionComplete = useCallback(() => {
    scrollControllerRef.current.isSwitchingPage = false
  }, [])

  const data: ScrollControlContextData = {
    isScrollVisited,
  }

  const onPageLoadComplete = useCallback(() => {
    scrollControllerRef.current.isLoadingPage = false
  }, [])

  const actions: ScrollControlContextActions = {
    onPageLoadComplete,
  }

  return (
    <AppScroll onScroll={handleOnScroll} ref={scrollRef}>
      <AppLayout>
        <ScrollControlProvider value={[data, actions]}>
          <PageTransition
            onTransitionStart={onPageTransitionStart}
            onTransitionComplete={onPageTransitionComplete}
            imperativeFadeIn
            ref={pageTransitionRef}
          >
            {children}
          </PageTransition>
        </ScrollControlProvider>
      </AppLayout>
    </AppScroll>
  )
}

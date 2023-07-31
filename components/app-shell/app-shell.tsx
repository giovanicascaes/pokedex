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
import PageScrollController from "./page-scroll-controller"

export default function AppShell({
  enableScrollControl = { enabled: false },
  children,
}: AppShellProps) {
  const [shouldRestoreScroll, setShouldRestoreScroll] = useState(false)
  const pageTransitionRef = useRef<PageTransitionElement>(null)
  const { pathname: currentPath } = useRouter()
  const scrollControllerRef = useRef(new PageScrollController())

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
    scrollControllerRef.current.saveCurrentPathScroll()
    scrollControllerRef.current.isTransitioningPage = true
  })

  useEffect(() => {
    scrollControllerRef.current.currentPath = currentPath
  }, [currentPath])

  useEffect(() => {
    const { enabled } = enableScrollControl

    if (enabled) {
      const { childrenPaths, waitForPageToLoad = false } = enableScrollControl

      scrollControllerRef.current.enable({ childrenPaths, waitForPageToLoad })
    } else {
      scrollControllerRef.current.disable()
    }
  }, [enableScrollControl])

  useEffect(() => {
    return () => {
      // Not a React node
      // eslint-disable-next-line react-hooks/exhaustive-deps
      scrollControllerRef.current.removeAllListeners()
    }
  }, [])

  const onPageTransitionStart = useCallback(async () => {
    if (!scrollControllerRef.current.isTransitioningPage) {
      return
    }

    setShouldRestoreScroll(
      scrollControllerRef.current.shouldRestorePreviousPosition
    )
    await scrollControllerRef.current.placeScroll()
    await pageTransitionRef.current?.resume()
    setShouldRestoreScroll(false)
  }, [])

  const onPageTransitionComplete = useCallback(() => {
    scrollControllerRef.current.isTransitioningPage = false
  }, [])

  const onPageLoadComplete = useCallback(() => {
    scrollControllerRef.current.onPageLoadComplete()
  }, [])

  const data: ScrollControlContextData = {
    shouldRestoreScroll,
  }

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
            ref={pageTransitionRef}
          >
            {children}
          </PageTransition>
        </ScrollControlProvider>
      </AppLayout>
    </AppScroll>
  )
}

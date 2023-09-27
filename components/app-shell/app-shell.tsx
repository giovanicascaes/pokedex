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
import AppScrollController from "./app-scroll-controller"

export default function AppShell({
  controlledScroll = { enabled: false },
  children,
}: AppShellProps) {
  const [isRestoringScroll, setIsRestoringScroll] = useState(false)
  const pageTransitionRef = useRef<PageTransitionElement>(null)
  const { pathname: currentPath } = useRouter()
  const scrollControllerRef = useRef(new AppScrollController())

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
    scrollControllerRef.current.isLeavingPage = true
  })

  useEffect(() => {
    scrollControllerRef.current.currentPath = currentPath
  }, [currentPath])

  useEffect(() => {
    const { enabled } = controlledScroll

    if (enabled) {
      const { childrenPaths, waitForPageToLoad = false } = controlledScroll

      scrollControllerRef.current.enable({ childrenPaths, waitForPageToLoad })
    } else {
      scrollControllerRef.current.disable()
    }
  }, [controlledScroll])

  useEffect(() => {
    return () => {
      // Not a React node
      // eslint-disable-next-line react-hooks/exhaustive-deps
      scrollControllerRef.current.removeAllListeners()
    }
  }, [])

  const onPageTransitionStart = useCallback(async () => {
    if (!scrollControllerRef.current.isLeavingPage) {
      return
    }

    setIsRestoringScroll(
      scrollControllerRef.current.shouldRestorePreviousPosition
    )

    await scrollControllerRef.current.placeScroll()

    setIsRestoringScroll(false)
    pageTransitionRef.current?.resume()
  }, [])

  const onPageTransitionComplete = useCallback(() => {
    scrollControllerRef.current.isLeavingPage = false
  }, [])

  const onPageLoadComplete = useCallback(() => {
    scrollControllerRef.current.onPageLoadComplete()
  }, [])

  const data: ScrollControlContextData = {
    isRestoringScroll,
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

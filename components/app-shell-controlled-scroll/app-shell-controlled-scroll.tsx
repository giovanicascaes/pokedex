import { AppLayout, AppScroll, PageTransition } from "components"
import {
  ScrollControlContextActions,
  ScrollControlContextData,
  ScrollControlProvider,
} from "contexts"
import { useCallback, useEffect, useState } from "react"
import { AppShellControlledScrollProps } from "./app-shell-controlled-scroll.types"
import useControlledScroll from "./use-controlled-scroll"

export default function AppShellControlledScroll({
  enableScrollControl = true,
  children,
}: AppShellControlledScrollProps) {
  const [isTransitionRunning, setIsTransitionRunning] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  const {
    onScroll,
    ref: scrollRef,
    isScrollSettled,
    isScrollDirty,
  } = useControlledScroll(
    enableScrollControl,
    isPageLoaded,
    isTransitionRunning
  )

  useEffect(() => {
    if (enableScrollControl) {
      setIsPageLoaded(false)
    }
  }, [children, enableScrollControl])

  const onPageTransitionStart = useCallback(() => {
    setIsTransitionRunning(true)
  }, [])

  const onPageTransitionComplete = useCallback(() => {
    setIsTransitionRunning(false)
  }, [])

  const data: ScrollControlContextData = {
    isPageLoaded,
    isScrollDirty,
  }

  const onPageLoadComplete = useCallback(() => {
    setIsPageLoaded(true)
  }, [])

  const actions: ScrollControlContextActions = {
    onPageLoadComplete,
  }

  return (
    <AppScroll onScroll={onScroll} ref={scrollRef}>
      <AppLayout>
        <ScrollControlProvider value={[data, actions]}>
          <PageTransition
            onTransitionStart={onPageTransitionStart}
            onTransitionComplete={onPageTransitionComplete}
            keepHiddenOnNextTransition={!isScrollSettled}
          >
            {children}
          </PageTransition>
        </ScrollControlProvider>
      </AppLayout>
    </AppScroll>
  )
}

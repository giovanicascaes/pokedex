import {
  AppLayout,
  AppScroll,
  AppScrollElement,
  PageTransition,
  PageTransitionElement,
} from "components"
import {
  PageBreadcrumbItem,
  PageContextActions,
  PageContextData,
  PageProvider,
  ThemeModeProvider,
} from "contexts"
import { useEvent, useIsoMorphicEffect, useRouterEvent } from "hooks"
import { useRouter } from "next/router"
import { UIEventHandler, useCallback, useRef, useState } from "react"
import { AppShellProps } from "./app-shell.types"
import useHistory from "./use-history"

export default function AppShell({
  scrollConfig = false,
  children,
}: AppShellProps) {
  const isScrollEnabled = !!scrollConfig
  const [breadcrumb, setBreadcrumb] = useState<PageBreadcrumbItem[]>([])
  const [isPageLoaded, setIsPageLoaded] = useState(true)
  const [isTransitionRunning, setIsTransitionRunning] = useState(false)
  const pageTransitionRef = useRef<null | PageTransitionElement>(null)
  const scrollElementRef = useRef<null | AppScrollElement>(null)
  const scrollTopRef = useRef(0)
  const scrollHistoryRef = useRef(new Map())
  const { pathname: currentPath } = useRouter()
  const history = useHistory()

  const handleOnScroll = useCallback<UIEventHandler<AppScrollElement>>(
    (event) => {
      const { scrollTop: nextScrollTop } = event.currentTarget

      scrollTopRef.current = nextScrollTop
    },
    []
  )

  const finishTransition = useEvent(() => {
    const [, previousPath] = history
    const shouldRestoreScroll =
      scrollConfig &&
      scrollConfig.restoreScrollIfComingFrom.includes(previousPath)

    scrollElementRef.current?.scrollTo({
      top: shouldRestoreScroll
        ? scrollHistoryRef.current.get(currentPath) ?? 0
        : 0,
    })
    pageTransitionRef.current?.resume()
  })

  useRouterEvent("routeChangeStart", () => {
    if (isScrollEnabled) {
      scrollHistoryRef.current.set(currentPath, scrollTopRef.current)
    }
  })

  useIsoMorphicEffect(() => {
    if (isTransitionRunning && isScrollEnabled) {
      setIsPageLoaded(false)
    }
  }, [isTransitionRunning, isScrollEnabled])

  useIsoMorphicEffect(() => {
    if (!isTransitionRunning && isPageLoaded) {
      finishTransition()
    }
  }, [finishTransition, isPageLoaded, isTransitionRunning])

  const data: PageContextData = {
    breadcrumb,
    history,
  }

  const updateBreadcrumb = useCallback((breadcrumb: PageBreadcrumbItem[]) => {
    setBreadcrumb(breadcrumb)

    return () => {
      setBreadcrumb([])
    }
  }, [])

  const onPageLoadComplete = useCallback(() => {
    setIsPageLoaded(true)
  }, [])

  const actions: PageContextActions = {
    updateBreadcrumb,
    onPageLoadComplete,
  }

  return (
    <ThemeModeProvider>
      <PageProvider value={[data, actions]}>
        <AppScroll onScroll={handleOnScroll} ref={scrollElementRef}>
          <AppLayout>
            <PageTransition
              onTransitionStart={() => {
                setIsTransitionRunning(true)
              }}
              onTransitionComplete={() => {
                setIsTransitionRunning(false)
              }}
              ref={pageTransitionRef}
            >
              {children}
            </PageTransition>
          </AppLayout>
        </AppScroll>
      </PageProvider>
    </ThemeModeProvider>
  )
}

import { Inter } from "@next/font/google"
import {
  animated,
  easings,
  useSpringRef,
  useTransition,
} from "@react-spring/web"
import { AppHeader, PageLoadingIndicator } from "components"
import {
  PageBreadcrumbItemProps,
  PagesContextActions,
  PagesContextData,
  PagesProvider,
  PokemonProvider,
  useThemeMode,
} from "contexts"
import { useAppScroll, useHistory, useIsoMorphicEffect } from "hooks"
import { SHELL_LAYOUT_CONTAINER_ELEMENT_ID } from "lib"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
import { AppShellProps } from "./app-shell.types"

const PAGE_TRANSITION_DURATION = 150

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export default function AppShell({ children }: AppShellProps) {
  const [isTransitionRunning, setIsTransitionRunning] = useState(false)
  const [loadingPage, setLoadingPage] = useState<string | null>(null)
  const [breadcrumb, setBreadcrumb] = useState<PageBreadcrumbItemProps[]>([])
  const [{ transitionClassName }] = useThemeMode()
  const { pathname: currentPath } = useRouter()
  const {
    onScroll,
    ref: scrollRef,
    isScrollReady,
    isScrollDirty,
  } = useAppScroll(loadingPage, isTransitionRunning)
  const history = useHistory()

  useIsoMorphicEffect(() => {
    setLoadingPage(currentPath)
  }, [currentPath, setLoadingPage])

  const data: PagesContextData = {
    loadingPage,
    isScrollDirty,
    breadcrumb,
    history,
  }

  const setUpBreadcrumb = useCallback(
    (breadcrumb: PageBreadcrumbItemProps[]) => {
      setBreadcrumb(breadcrumb)

      return () => {
        setBreadcrumb([])
      }
    },
    []
  )

  const actions: PagesContextActions = {
    setLoadingPage,
    setUpBreadcrumb,
  }

  const transitionRef = useSpringRef()
  const transition = useTransition(children, {
    key: children,
    ref: transitionRef,
    config: {
      easing: easings.linear,
      duration: PAGE_TRANSITION_DURATION,
    },
    from: {
      transform: "translateY(30px)",
      opacity: 0,
    },
    enter: {
      transform: "translateY(0px)",
      opacity: isScrollReady ? 1 : 0,
    },
    leave: {
      transform: "translateY(30px)",
      opacity: 0,
    },
    onStart() {
      setIsTransitionRunning(true)
    },
    onRest() {
      setIsTransitionRunning(false)
    },
    exitBeforeEnter: true,
  })

  useEffect(() => {
    transitionRef.start()
  }, [children, transitionRef])

  useEffect(() => {
    if (isScrollReady) {
      transitionRef.start({
        opacity: 1,
      })
    }
  }, [isScrollReady, transitionRef])

  return (
    <main
      id={SHELL_LAYOUT_CONTAINER_ELEMENT_ID}
      className={twMerge(
        inter.variable,
        "font-sans bg-slate-50 dark:bg-slate-800 flex flex-col h-full overflow-auto",
        transitionClassName
      )}
      onScroll={onScroll}
      ref={scrollRef}
    >
      <PageLoadingIndicator />
      <PagesProvider value={[data, actions]}>
        <PokemonProvider>
          <AppHeader className="sticky top-0 z-10 flex-shrink-0" />
          {transition((transitionStyle, page) => (
            <animated.div
              className="flex-1"
              style={{
                ...transitionStyle,
              }}
            >
              {page}
            </animated.div>
          ))}
        </PokemonProvider>
      </PagesProvider>
    </main>
  )
}

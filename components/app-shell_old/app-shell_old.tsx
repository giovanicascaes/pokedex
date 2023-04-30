import { Inter } from "@next/font/google"
import {
  animated,
  easings,
  useSpringRef,
  useTransition,
} from "@react-spring/web"
import { AppHeader, PageLoadingIndicator } from "components"
import {
  PageBreadcrumbItem,
  PageContextActions,
  PageContextData,
  PageProvider,
  PokemonProvider,
  useThemeMode,
} from "contexts"
import { useAppScroll, useHistory } from "hooks"
import { SHELL_LAYOUT_CONTAINER_ELEMENT_ID } from "lib"
import { useCallback, useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
import { AppShell_OldProps } from "./app-shell_old.types"

const PAGE_TRANSITION_DURATION = 150

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export default function AppShell_Old({
  enableScrollControl = false,
  className,
  children,
  ...other
}: AppShell_OldProps) {
  const [isTransitionRunning, setIsTransitionRunning] = useState(false)
  const [isContentLoaded, setIsContentLoaded] = useState(false)
  const [breadcrumb, setBreadcrumb] = useState<PageBreadcrumbItem[]>([])
  const [{ transitionClassName }] = useThemeMode()
  const {
    onScroll,
    ref: scrollRef,
    isScrollSettled,
    isScrollDirty,
  } = useAppScroll(enableScrollControl, isContentLoaded, isTransitionRunning)
  const history = useHistory()

  useEffect(() => {
    setIsContentLoaded(false)
  }, [children])

  const data: PageContextData = {
    isContentLoaded,
    isScrollDirty,
    breadcrumb,
    history,
  }

  const onPageLoad = useCallback(() => {
    setIsContentLoaded(true)
  }, [])

  const setUpBreadcrumb = useCallback((breadcrumb: PageBreadcrumbItem[]) => {
    setBreadcrumb(breadcrumb)

    return () => {
      setBreadcrumb([])
    }
  }, [])

  const actions: PageContextActions = {
    onPageLoad,
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
      opacity: isScrollSettled ? 1 : 0,
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
    if (isScrollSettled) {
      transitionRef.start({
        opacity: 1,
      })
    }
  }, [isScrollSettled, transitionRef])

  return (
    <div
      {...other}
      id={SHELL_LAYOUT_CONTAINER_ELEMENT_ID}
      className={twMerge(
        inter.variable,
        "font-sans bg-slate-50 dark:bg-slate-800 flex flex-col h-full overflow-auto",
        transitionClassName,
        className
      )}
      onScroll={onScroll}
      ref={scrollRef}
    >
      <PageLoadingIndicator />
      <PageProvider value={[data, actions]}>
        <PokemonProvider>
          <AppHeader className="sticky top-0 z-10 flex-shrink-0" />
          {transition((transitionStyle, page) => (
            <animated.main
              className="flex-1"
              style={{
                ...transitionStyle,
              }}
            >
              {page}
            </animated.main>
          ))}
        </PokemonProvider>
      </PageProvider>
    </div>
  )
}

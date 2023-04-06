import { Inter } from "@next/font/google"
import {
  animated,
  easings,
  useSpringRef,
  useTransition,
} from "@react-spring/web"
import { AppHeader, PageLoadingIndicator } from "components"
import {
  PageStateContextActions,
  PageStateContextData,
  PageStateProvider,
  useThemeMode,
} from "contexts"
import { useAppScrollManagement } from "hooks"
import { SHELL_LAYOUT_CONTAINER_ELEMENT_ID } from "lib"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
import { AppShellProps } from "./app-shell.types"

const PAGE_TRANSITION_DURATION = 150

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export default function AppShell({ children }: AppShellProps) {
  const [isTransitionRunning, setIsTransitionRunning] = useState(false)
  const [isSettingUpPage, setIsSettingUpPage] = useState<string | null>(null)
  const { asPath: currentPath } = useRouter()
  const {
    onScroll,
    ref: scrollRef,
    isScrollReady,
  } = useAppScrollManagement(isSettingUpPage, isTransitionRunning)
  const [{ transitionClassNames }] = useThemeMode()

  useEffect(() => {
    setIsSettingUpPage(currentPath)
  }, [currentPath, setIsSettingUpPage])

  const data: PageStateContextData = {
    isSettingUpPage,
  }

  const actions: PageStateContextActions = {
    setIsSettingUpPage,
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
    <PageStateProvider value={[data, actions]}>
      <main
        id={SHELL_LAYOUT_CONTAINER_ELEMENT_ID}
        className={twMerge(
          inter.variable,
          "font-sans h-full overflow-auto",
          transitionClassNames
        )}
        onScroll={onScroll}
        ref={scrollRef}
      >
        <PageLoadingIndicator />
        <AppHeader className="sticky top-0 z-40" />
        {transition((transitionStyle, page) => (
          <animated.div
            className="bg-slate-50 dark:bg-slate-800 min-h-screen"
            style={{
              ...transitionStyle,
            }}
          >
            {page}
          </animated.div>
        ))}
      </main>
    </PageStateProvider>
  )
}

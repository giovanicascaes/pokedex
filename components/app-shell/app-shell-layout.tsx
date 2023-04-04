import { Inter } from "@next/font/google"
import { animated, easings, useTransition } from "@react-spring/web"
import { AppHeader, PageLoadingIndicator } from "components"
import { useLayoutControl, useThemeMode } from "contexts"
import { useAppScrollManagement, usePrevious } from "hooks"
import { SHELL_LAYOUT_CONTAINER_ELEMENT_ID } from "lib"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
import { AppShellLayoutProps } from "./app-shell.types"

const TRANSITION_DURATION = 150

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export default function AppShellLayout({ children }: AppShellLayoutProps) {
  const [isTransitionRunning, setIsTransitionRunning] = useState(false)
  const { asPath: currentPath } = useRouter()
  const prevPath = usePrevious(currentPath)
  const [{ isPageReady }, { setIsPageReady }] = useLayoutControl()
  const { onScroll, ref: scrollRef } = useAppScrollManagement(
    isTransitionRunning || !isPageReady
  )
  const [{ transitionClassNames }] = useThemeMode()

  useEffect(() => {
    const hasChangedToPokemonView =
      prevPath && currentPath === "/" && prevPath !== currentPath

    if (hasChangedToPokemonView) {
      setIsPageReady(false)
    }
  }, [currentPath, prevPath, setIsPageReady])

  const transition = useTransition(children, {
    key: children,
    config: {
      easing: easings.linear,
      duration: TRANSITION_DURATION,
    },
    from: {
      transform: "translateY(-30px)",
      opacity: 0,
    },
    enter: {
      transform: "translateY(0px)",
      opacity: 1,
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

  return (
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
      {transition((style, render) => (
        <animated.div
          className="bg-slate-50 dark:bg-slate-800 min-h-screen"
          style={{ ...style }}
        >
          {render}
        </animated.div>
      ))}
    </main>
  )
}

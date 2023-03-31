import { animated, useTransition } from "@react-spring/web"
import { Router } from "next/router"
import { useEffect, useState } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import {
  PageLoadingBarsProps,
  PageLoadingIndicatorProps,
} from "./page-loading-indicator.types"

function LoadingBar({ className, ...other }: PageLoadingBarsProps) {
  return (
    <div
      {...other}
      className={twJoin(
        "absolute h-full bg-red-500 dark:bg-red-400",
        className
      )}
    />
  )
}

const TRANSITION_DURATION = 200

export default function PageLoadingIndicator({
  className,
  ...other
}: PageLoadingIndicatorProps) {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const start = () => {
      setIsLoading(true)
    }
    const end = () => {
      setIsLoading(false)
    }

    Router.events.on("routeChangeStart", start)
    Router.events.on("routeChangeComplete", end)
    Router.events.on("routeChangeError", end)

    return () => {
      Router.events.off("routeChangeStart", start)
      Router.events.off("routeChangeComplete", end)
      Router.events.off("routeChangeError", end)
    }
  }, [])

  const transitions = useTransition(isLoading, {
    key: isLoading,
    config: { duration: TRANSITION_DURATION },
    from: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
    },
    leave: {
      opacity: 0,
    },
  })

  return transitions(
    (styles, show) =>
      show && (
        <animated.div
          {...other}
          className={twMerge(
            "fixed z-50 top-0 w-full h-0.5 bg-red-200 dark:bg-red-500/40 transition-all",
            className
          )}
          style={{ ...styles }}
        >
          <LoadingBar className="animate-progress-bar-left" />
          <LoadingBar className="animate-progress-bar-right" />
        </animated.div>
      )
  )
}

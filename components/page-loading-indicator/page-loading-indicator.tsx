import { animated, useTransition } from "@react-spring/web"
import { useRouterEvent } from "hooks"
import { useState } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import {
  PageLoadingIndicatorProgressBarProps,
  PageLoadingIndicatorProps,
} from "./page-loading-indicator.types"

function ProgressBar({
  className,
  ...other
}: PageLoadingIndicatorProgressBarProps) {
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

  const start = () => {
    setIsLoading(true)
  }
  const end = () => {
    setIsLoading(false)
  }

  useRouterEvent("routeChangeStart", start)
  useRouterEvent("routeChangeComplete", end)
  useRouterEvent("routeChangeError", end)

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
          <ProgressBar className="animate-progress-bar-left" />
          <ProgressBar className="animate-progress-bar-right" />
        </animated.div>
      )
  )
}

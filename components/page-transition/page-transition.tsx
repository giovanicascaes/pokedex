import {
  animated,
  easings,
  useSpringRef,
  useTransition,
} from "@react-spring/web"
import { useEffect } from "react"
import { twMerge } from "tailwind-merge"
import { PageTransitionProps } from "./page-transition.types"

const PAGE_TRANSITION_DURATION = 150

export default function PageTransition({
  keepHiddenOnNextTransition = false,
  onTransitionStart,
  onTransitionComplete,
  children,
  className,
  style,
  ...other
}: PageTransitionProps) {
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
      opacity: keepHiddenOnNextTransition ? 0 : 1,
    },
    leave: {
      transform: "translateY(30px)",
      opacity: 0,
    },
    onStart() {
      onTransitionStart?.()
    },
    onRest() {
      onTransitionComplete?.()
    },
    exitBeforeEnter: true,
  })

  useEffect(() => {
    transitionRef.start()
  }, [children, transitionRef])

  useEffect(() => {
    if (!keepHiddenOnNextTransition) {
      transitionRef.start({
        opacity: 1,
      })
    }
  }, [keepHiddenOnNextTransition, transitionRef])

  return transition((transitionStyle, page) => (
    <animated.div
      {...other}
      className={twMerge("flex-1", className)}
      style={{
        ...style,
        ...transitionStyle,
      }}
    >
      {page}
    </animated.div>
  ))
}

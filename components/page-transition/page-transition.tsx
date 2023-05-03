import {
  animated,
  easings,
  useSpringRef,
  useTransition,
} from "@react-spring/web"
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { twMerge } from "tailwind-merge"
import {
  PageTransitionElement,
  PageTransitionProps,
  PageTransitionStatus,
} from "./page-transition.types"

const PAGE_TRANSITION_DURATION = 150

export default forwardRef<PageTransitionElement, PageTransitionProps>(
  function PageTransition(
    {
      imperativeFadeIn = false,
      onTransitionStart,
      onTransitionComplete,
      children,
      className,
      style,
      ...other
    },
    ref
  ) {
    const transitionStatus = useRef<PageTransitionStatus>("idle")
    const transitionRef = useSpringRef()
    const transition = useTransition(children, {
      key: children,
      ref: transitionRef,
      config: {
        easing: easings.linear,
        duration: PAGE_TRANSITION_DURATION,
      },
      from: {
        y: 30,
        opacity: 0,
      },
      enter: {
        y: 0,
        opacity: imperativeFadeIn ? 0 : 1,
      },
      leave: {
        y: 30,
        opacity: 0,
      },
      onStart() {
        if (transitionStatus.current === "idle") {
          transitionStatus.current = "fading-out"
          onTransitionStart?.()
        } else {
          transitionStatus.current = "fading-in"
        }
      },
      onRest() {
        if (transitionStatus.current === "fading-out") {
          onTransitionComplete?.()
        } else {
          transitionStatus.current = "idle"
        }
      },
      exitBeforeEnter: true,
    })

    useEffect(() => {
      transitionRef.start()
    }, [children, transitionRef])

    useImperativeHandle(
      ref,
      () => ({
        resumeFade() {
          transitionRef.start({
            from: {
              y: 30,
              opacity: 0,
            },
            to: {
              y: 0,
              opacity: 1,
            },
          })
        },
      }),
      [transitionRef]
    )

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
)

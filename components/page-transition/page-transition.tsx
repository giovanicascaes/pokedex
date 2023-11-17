import {
  animated,
  easings,
  useSpring,
  useSpringRef,
  useTransition,
} from "@react-spring/web"
import { useEvent, useIsoMorphicEffect } from "hooks"
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { twMerge } from "tailwind-merge"
import { match } from "utils"
import {
  PageTransitionElement,
  PageTransitionProps,
  PageTransitionState,
} from "./page-transition.types"

const PAGE_TRANSITION_DURATION = 150

const PAGE_TRANSITION_HIDDEN_STYLE = {
  opacity: 0,
  y: -30,
}

const PAGE_TRANSITION_FINAL_STYLE = {
  opacity: 1,
  y: 0,
}

export default forwardRef<PageTransitionElement, PageTransitionProps>(
  function PageTransition(
    {
      onTransitionStart,
      onTransitionComplete,
      children,
      className,
      style,
      ...other
    },
    ref
  ) {
    const onTransitionStartCb = useEvent(onTransitionStart)
    const onTransitionCompleteCb = useEvent(onTransitionComplete)
    const [state, setState] = useState<PageTransitionState>("fading-in")
    const isRunningRef = useRef(true)
    const fadeOutRef = useSpringRef()
    const fadeOutTransition = useTransition(children, {
      key: children,
      ref: fadeOutRef,
      config: {
        easing: easings.linear,
        duration: PAGE_TRANSITION_DURATION,
      },
      from: PAGE_TRANSITION_FINAL_STYLE,
      leave: PAGE_TRANSITION_HIDDEN_STYLE,
      onStart() {
        setState("fading-out")
      },
      onRest() {
        setState("paused")
      },
      exitBeforeEnter: true,
    })
    const [fadeInStyle, fadeInApi] = useSpring(() => ({
      from: PAGE_TRANSITION_HIDDEN_STYLE,
      config: {
        easing: easings.linear,
        duration: PAGE_TRANSITION_DURATION,
      },
      onStart() {
        fadeOutRef.set(PAGE_TRANSITION_FINAL_STYLE)
      },
      onRest() {
        isRunningRef.current = false
        setState("idle")
      },
    }))

    const fadeInTransition = useCallback(() => {
      fadeInApi.start({
        from: PAGE_TRANSITION_HIDDEN_STYLE,
        to: PAGE_TRANSITION_FINAL_STYLE,
      })
    }, [fadeInApi])

    useIsoMorphicEffect(() => {
      if (!isRunningRef.current) {
        isRunningRef.current = true
        fadeOutRef.start()
      }
    }, [children, fadeOutRef])

    useIsoMorphicEffect(() => {
      if (state === "fading-out") {
        onTransitionStartCb?.()
      }
    }, [onTransitionStartCb, state])

    useIsoMorphicEffect(() => {
      if (state === "paused") {
        onTransitionCompleteCb?.()
      }
    }, [onTransitionCompleteCb, state])

    useIsoMorphicEffect(() => {
      if (state === "fading-in") {
        fadeInTransition()
      }
    }, [fadeInTransition, state])

    useImperativeHandle(
      ref,
      () => ({
        resume() {
          setState("fading-in")
        },
      }),
      []
    )

    return fadeOutTransition((fadeOutStyle, page) => (
      <animated.div
        {...other}
        className={twMerge("h-full", className)}
        style={{
          ...style,
          ...match(
            {
              idle: fadeOutStyle,
              "fading-in": fadeInStyle,
              "fading-out": fadeOutStyle,
              paused: PAGE_TRANSITION_HIDDEN_STYLE,
            },
            state
          ),
        }}
      >
        {page}
      </animated.div>
    ))
  }
)

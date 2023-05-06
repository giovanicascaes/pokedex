import {
  animated,
  easings,
  useSpring,
  useSpringRef,
  useTransition,
} from "@react-spring/web"
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { twMerge } from "tailwind-merge"
import {
  PageTransitionElement,
  PageTransitionProps,
} from "./page-transition.types"

const PAGE_TRANSITION_DURATION = 150

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
    const isFirstTransitionRef = useRef(true)
    const isChangingPageRef = useRef(false)
    const [isFadingIn, setIsFadingIn] = useState(true)
    const fadeOutRef = useSpringRef()
    const fadeOutTransition = useTransition(children, {
      key: children,
      ref: fadeOutRef,
      config: {
        easing: easings.linear,
        duration: PAGE_TRANSITION_DURATION,
      },
      from: {
        y: -30,
        opacity: 0,
      },
      enter: {
        y: 0,
        opacity: 1,
      },
      leave: {
        y: -30,
        opacity: 0,
      },
      initial: {
        y: 0,
        opacity: 1,
      },
      onStart() {
        if (!isChangingPageRef.current) {
          isChangingPageRef.current = true
          onTransitionStart?.()
        }
      },
      onRest() {
        if (isChangingPageRef.current) {
          isChangingPageRef.current = false
          onTransitionComplete?.()
        }
      },
      exitBeforeEnter: true,
    })
    const [fadeInStyle, fadeInApi] = useSpring(() => ({
      config: {
        easing: easings.linear,
        duration: PAGE_TRANSITION_DURATION,
      },
      from: {
        y: -30,
        opacity: 0,
      },
      to: {
        y: 0,
        opacity: 1,
      },
      onStart() {
        setIsFadingIn(true)
      },
      onRest() {
        isFirstTransitionRef.current = false
        setIsFadingIn(false)
      },
    }))

    useEffect(() => {
      if (isChangingPageRef.current) return

      if (isFirstTransitionRef.current) {
        fadeInApi.start()
      } else {
        fadeOutRef.start()
      }
    }, [children, fadeInApi, fadeOutRef, isChangingPageRef])

    useImperativeHandle(
      ref,
      () => ({
        resume() {
          fadeInApi.start()
        },
      }),
      [fadeInApi]
    )

    return fadeOutTransition((fadeOutStyle, page) => (
      <animated.div
        {...other}
        className={twMerge("h-full", className)}
        style={{
          ...style,
          ...(isFadingIn ? fadeInStyle : fadeOutStyle),
        }}
      >
        {page}
      </animated.div>
    ))
  }
)

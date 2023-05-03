import { animated, easings, useSpring } from "@react-spring/web"
import { usePrevious } from "hooks"
import { SHELL_LAYOUT_CONTAINER_ELEMENT_ID } from "lib"
import { useRouter } from "next/router"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { createPortal } from "react-dom"
import { twMerge } from "tailwind-merge"
import {
  PageTransition2Element,
  PageTransition2Props,
  PageTransition2Status,
} from "./page-transition2.types"

const PAGE_TRANSITION_DURATION = 1500

const transitionConfig = {
  easing: easings.linear,
  duration: PAGE_TRANSITION_DURATION,
}

export default forwardRef<PageTransition2Element, PageTransition2Props>(
  function PageTransition(
    {
      imperativeFadeIn = false,
      onTransitionComplete,
      children,
      className,
      style,
      ...other
    },
    ref
  ) {
    const [status, setStatus] = useState<PageTransition2Status>("idle")
    const { pathname: currentPath } = useRouter()
    const prevChildren = usePrevious(children)
    console.log(
      "🚀 ~ file: page-transition2.tsx:36 ~ prevChildren:",
      prevChildren
    )
    console.log("🚀 ~ file: page-transition2.tsx:36 ~ children:", children)
    const prevPath = usePrevious(currentPath)
    const [newPageStyle, newPageApi] = useSpring(() => ({
      config: transitionConfig,
      from: {
        y: -30,
        opacity: 0,
      },
      onStart() {
        setStatus("fading-in")
      },
      onRest() {
        setStatus("idle")
      },
    }))
    const [prevPageStyle, prevPageApi] = useSpring(() => ({
      config: transitionConfig,
      from: {
        y: 0,
        opacity: 1,
      },
      onStart() {
        setStatus("fading-out")
      },
      onRest() {
        onTransitionComplete?.()
      },
    }))

    useEffect(() => {
      if (status === "fading-in") {
        newPageApi.start({
          y: 0,
          opacity: 1,
        })
      }
    }, [newPageApi, status])

    useImperativeHandle(
      ref,
      () => ({
        start() {
          console.log(
            "🚀 ~ file: page-transition2.tsx:83 ~ start ~ prevPath:",
            prevPath
          )
          console.log(
            "🚀 ~ file: page-transition2.tsx:84 ~ start ~ currentPath:",
            currentPath
          )
          if (prevPath && prevPath !== currentPath) {
            prevPageApi.start({
              y: -30,
              opacity: 0,
            })
          } else {
            newPageApi.start({
              y: 0,
              opacity: 1,
            })
          }
        },
      }),
      [currentPath, newPageApi, prevPageApi, prevPath]
    )
    console.log("🚀 ~ file: page-transition2.tsx:115 ~ status:", status)

    return (
      <>
        <animated.div
          {...other}
          className={twMerge("flex-1", className)}
          style={{
            ...style,
            ...newPageStyle,
            opacity: status === "fading-out" ? 0 : newPageStyle.opacity,
          }}
        >
          <div style={{ backgroundColor: "red" }}>{children}</div>
        </animated.div>
        {(status === "fading-out" || (prevPath && prevPath !== currentPath)) &&
          createPortal(
            <animated.div
              {...other}
              className={twMerge(
                "flex-1",
                className,
                "absolute top-0 left-0 z-40 w-full h-full pointer-events-none"
              )}
              style={{
                ...style,
                ...prevPageStyle,
              }}
            >
              <div style={{ backgroundColor: "blue" }}>{prevChildren}</div>
            </animated.div>,
            document.getElementById(SHELL_LAYOUT_CONTAINER_ELEMENT_ID)!
          )}
      </>
    )
  }
)

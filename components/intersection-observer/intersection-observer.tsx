import { useEvent, useIntersectionObserver, usePrevious } from "hooks"
import { Children, cloneElement, useEffect } from "react"
import { mergeRefs } from "utils"
import { IntersectionObserverProps } from "./intersection-observer.types"

export default function IntersectionObserver({
  onIntersectionChange,
  children,
  hidden = false,
  ...options
}: IntersectionObserverProps) {
  const intersectionChangeHandlerCb = useEvent(onIntersectionChange)

  useEffect(() => {
    if (hidden) {
      console.log("mounted")

      return () => {
        console.log("unmounted")
      }
    }
  }, [hidden])

  const [intersectionObserverRef, isIntersecting] =
    useIntersectionObserver(options)
  const prevIsIntersecting = usePrevious(isIntersecting)

  useEffect(() => {
    if (
      prevIsIntersecting !== undefined &&
      prevIsIntersecting !== isIntersecting
    ) {
      intersectionChangeHandlerCb?.(isIntersecting)
    }
  }, [intersectionChangeHandlerCb, isIntersecting, prevIsIntersecting])

  const child = Children.only(children)

  return cloneElement(child, {
    ...child.props,
    ref: mergeRefs(child.props.ref, intersectionObserverRef),
  })
}

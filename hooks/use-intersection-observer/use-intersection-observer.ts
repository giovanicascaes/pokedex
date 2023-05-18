import { useIsoMorphicEffect, usePrevious } from "hooks"
import { useRef, useState } from "react"
import {
  UseIntersectionObserverArgs,
  UseIntersectionObserverReturn,
} from "./use-intersection-observer.types"

export default function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = "0%",
  freezeOnceVisible = false,
  disconnectOnceVisible = false,
  disconnectOnceNoLongerVisible = false,
  enabled = true,
}: UseIntersectionObserverArgs = {}): UseIntersectionObserverReturn {
  const observerRef = useRef<IntersectionObserver>()
  const [el, ref] = useState<Element | null>(null)
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false)
  const prevIsIntersecting = usePrevious(isIntersecting)

  useIsoMorphicEffect(() => {
    if (!el || !enabled) return

    const observerCallback = ([entry]: IntersectionObserverEntry[]): void => {
      const { isIntersecting } = entry

      if (isIntersecting || !freezeOnceVisible) {
        setIsIntersecting(isIntersecting)
      }
    }
    const observerOptions = { threshold, root, rootMargin }

    observerRef.current = new IntersectionObserver(
      observerCallback,
      observerOptions
    )
    observerRef.current.observe(el)

    return () => {
      observerRef.current!.disconnect()
    }
    // Disable rule to not trigger rerender when `threshold` is an array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, rootMargin, el, threshold.toString(), freezeOnceVisible])

  useIsoMorphicEffect(() => {
    if (
      (disconnectOnceVisible && isIntersecting) ||
      (disconnectOnceNoLongerVisible && !isIntersecting && prevIsIntersecting)
    ) {
      observerRef.current?.disconnect()
    }
  }, [
    isIntersecting,
    disconnectOnceVisible,
    disconnectOnceNoLongerVisible,
    prevIsIntersecting,
  ])

  return [ref, isIntersecting]
}

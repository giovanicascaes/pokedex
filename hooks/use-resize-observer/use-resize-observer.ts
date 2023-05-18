import debounce from "lodash.debounce"
import { useEffect, useRef, useState } from "react"
import {
  UseResizeObserverArgs,
  UseResizeObserverReturn,
} from "./use-resize-observer.types"

export default function useResizeObserver({
  wait = 0,
  computeInitialRect = false,
}: UseResizeObserverArgs = {}): UseResizeObserverReturn {
  const observerRef = useRef<ResizeObserver>()
  const [el, ref] = useState<Element | null>(null)
  const [rect, setRect] = useState<DOMRectReadOnly | null>(null)

  useEffect(() => {
    if (!el) return

    const observerCallback = ([entry]: ResizeObserverEntry[]): void => {
      const { contentRect } = entry

      setRect(contentRect)
    }

    observerRef.current = new ResizeObserver(debounce(observerCallback, wait))
    observerRef.current.observe(el)

    if (computeInitialRect) {
      setRect(el.getBoundingClientRect())
    }

    return () => {
      observerRef.current!.disconnect()
    }
  }, [computeInitialRect, el, wait])

  return [ref, rect]
}

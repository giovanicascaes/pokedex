import debounce from "lodash.debounce"
import { useEffect, useRef, useState } from "react"
import {
  UseResizeObserverArgs,
  UseResizeObserverReturn,
} from "./use-resize-observer.types"

export default function useResizeObserver({
  wait = 0,
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

    return () => {
      observerRef.current!.disconnect()
    }
  }, [el, wait])

  return [ref, rect]
}

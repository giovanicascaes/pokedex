import { cloneElement, ReactElement, useLayoutEffect, useState } from "react"
import { env, mergeRefs } from "utils"

export default function useElementRect(
  element: ReactElement,
  computeRect: boolean = false
) {
  const [ourElement, elementRef] = useState<HTMLElement | null>(null)
  const [elementRect, setElementRect] = useState(DOMRect.fromRect())

  const elementObserved = cloneElement(element, {
    ...element.props,
    ref: mergeRefs(element.props.ref, elementRef),
  })

  useLayoutEffect(() => {
    if (ourElement && computeRect && env.isClient) {
      setElementRect(ourElement.getBoundingClientRect().toJSON())
    }
  }, [ourElement, computeRect])

  return {
    elementObserved,
    elementRect,
  }
}

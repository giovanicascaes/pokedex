import { cloneElement, ReactElement, useLayoutEffect, useState } from "react"
import { mergeRefs } from "utils"

export default function useChildrenRect(
  theirChildren: ReactElement,
  computeRect: boolean = false
) {
  const [childrenElement, childrenRef] = useState<HTMLElement | null>(null)
  const [childrenRect, setChildrenRect] = useState(DOMRect.fromRect())

  const trackedChildren = cloneElement(theirChildren, {
    ...theirChildren.props,
    ref: mergeRefs(theirChildren.props.ref, childrenRef),
  })

  useLayoutEffect(() => {
    if (childrenElement && computeRect) {
      setChildrenRect(childrenElement.getBoundingClientRect().toJSON())
    }
  }, [childrenElement, computeRect])

  return {
    trackedChildren,
    childrenRect,
  }
}

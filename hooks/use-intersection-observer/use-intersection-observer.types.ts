import { RefCallback } from "react"

export interface UseIntersectionObserverArgs extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
  disconnectOnceVisible?: boolean
  disconnectOnceNoLongerVisible?: boolean
  enabled?: boolean
}

export type UseIntersectionObserverReturn = readonly [
  RefCallback<Element>,
  boolean
]

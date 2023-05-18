import { RefCallback } from "react"

export interface UseResizeObserverArgs {
  wait?: number
  computeInitialRect?: boolean
}

export type UseResizeObserverReturn = readonly [
  RefCallback<Element>,
  DOMRect | null
]

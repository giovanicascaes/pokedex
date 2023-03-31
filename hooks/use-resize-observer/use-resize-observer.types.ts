import { RefCallback } from "react"

export interface UseResizeObserverArgs {
  wait?: number
}

export type UseResizeObserverReturn = readonly [
  RefCallback<Element>,
  DOMRect | null
]

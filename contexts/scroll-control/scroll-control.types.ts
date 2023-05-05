import { ReactNode } from "react"

export interface ScrollControlContextData {
  isScrollVisited: boolean
}

export interface ScrollControlContextActions {
  onPageLoadComplete: () => void
}

export type ScrollControlContextValue = [
  ScrollControlContextData,
  ScrollControlContextActions
]

export interface ScrollControlProviderProps {
  children: ReactNode
}
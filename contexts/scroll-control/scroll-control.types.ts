import { ReactNode } from "react"

export interface ScrollControlContextData {
  isPreviousScrollSaved: boolean
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

import { ReactNode } from "react"

export interface LayoutControlContextData {
  isPageReady: boolean
}

export interface LayoutControlContextActions {
  setIsPageReady: (ready: boolean) => void
}

export type LayoutControlContextValue = [
  LayoutControlContextData,
  LayoutControlContextActions
]

export interface LayoutControlProviderProps {
  children: ReactNode
}

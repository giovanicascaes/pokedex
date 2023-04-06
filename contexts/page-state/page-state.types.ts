import { ReactNode } from "react"

export interface PageStateContextData {
  isSettingUpPage: string | null
}

export interface PageStateContextActions {
  setIsSettingUpPage: (path: string | null) => void
}

export type PageStateContextValue = [
  PageStateContextData,
  PageStateContextActions
]

export interface PageStateProviderProps {
  children: ReactNode
}

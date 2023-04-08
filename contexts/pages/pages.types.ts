import { ReactNode } from "react"

export interface PagesContextData {
  loadingPage: string | null
  isScrollDirty: boolean
}

export interface PagesContextActions {
  setLoadingPage: (path: string | null) => void
}

export type PagesContextValue = [PagesContextData, PagesContextActions]

export interface PagesProviderProps {
  children: ReactNode
}

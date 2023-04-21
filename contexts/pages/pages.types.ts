import { BreadcrumbLinkProps } from "components"
import { ReactNode } from "react"

export interface PageBreadcrumbItemProps {
  label: string
  href?: BreadcrumbLinkProps["href"]
}
export interface PagesContextData {
  loadingPage: string | null
  isScrollDirty: boolean
  breadcrumb: PageBreadcrumbItemProps[]
  history: string[]
}

export interface PagesContextActions {
  setLoadingPage: (path: string | null) => void
  setUpBreadcrumb: (breadcrumb: PageBreadcrumbItemProps[]) => () => void
}

export type PagesContextValue = [PagesContextData, PagesContextActions]

export interface PagesProviderProps {
  children: ReactNode
}

import { BreadcrumbLinkProps } from "components"
import { ReactNode } from "react"

export interface PageBreadcrumbItem {
  label: string
  href?: BreadcrumbLinkProps["href"]
}

export interface PageContextData {
  breadcrumb: PageBreadcrumbItem[]
  history: string[]
}

export interface PageContextActions {
  setUpBreadcrumb: (breadcrumb: PageBreadcrumbItem[]) => () => void
}

export type PageContextValue = [PageContextData, PageContextActions]

export interface PageProviderProps {
  children: ReactNode
}

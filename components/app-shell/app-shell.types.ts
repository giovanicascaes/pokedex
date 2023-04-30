import { ReactNode } from "react"

export interface AppShellProps {
  children: ReactNode
  enableScrollControl?: boolean
  restoreScrollOnNavigatingFrom?: string[]
}

export interface AppShellScrollHistoryEntry {
  visited: boolean
  scrollTop: number
}

export type AppShellScrollEvent =
  | "scrollResolve"
  | "pageTransitionComplete"
  | "pageLoadComplete"

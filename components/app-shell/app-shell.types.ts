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

export type AppShellScrollPositionStatus = "resolving" | "resting"

export type AppShellScrollEvent = "reset" | "rest"

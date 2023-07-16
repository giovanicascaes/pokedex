import { ReactNode } from "react"
import { PageScrollControlConfig } from "types"

export interface AppShellProps {
  children: ReactNode
  enableScrollControl?: PageScrollControlConfig
}

export type PageRenderingEvent = "pageTransitionComplete" | "pageLoadComplete"

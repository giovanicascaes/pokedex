import { ReactNode } from "react"
import { AppControlledScrollConfig } from "types"

export interface AppShellProps {
  children: ReactNode
  controlledScroll?: AppControlledScrollConfig
}

export type PageRenderingEvent = "pageUnmountComplete" | "pageLoadComplete"

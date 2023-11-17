import { ReactNode } from "react"
import { AppScrollConfig } from "types"

export interface AppShellProps {
  children: ReactNode
  scrollConfig?: AppScrollConfig
}

export type PageRenderingEvent = "pageUnmountComplete" | "pageLoadComplete"

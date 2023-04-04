import { ReactNode } from "react"

export interface AppShellProps {
  children: ReactNode
}

export type AppShellLayoutProps = Pick<AppShellProps, "children">

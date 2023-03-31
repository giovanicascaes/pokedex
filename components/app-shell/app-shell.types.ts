import { ReactNode } from "react"

export interface AppShellProps {
  children: ReactNode
}

export type ShellLayoutProps = Pick<AppShellProps, "children">

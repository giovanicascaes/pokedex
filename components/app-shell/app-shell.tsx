import { AppLayout, AppScroll, PageTransition } from "components"
import { AppShellProps } from "./app-shell.types"

export default function AppShell({ children }: AppShellProps) {
  return (
    <AppScroll>
      <AppLayout>
        <PageTransition>{children}</PageTransition>
      </AppLayout>
    </AppScroll>
  )
}

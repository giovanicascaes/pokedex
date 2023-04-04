import { LayoutControlProvider } from "contexts"
import { AppShellProps } from "./app-shell.types"
import AppShellLayout from "./app-shell-layout"

export default function AppShell({ children }: AppShellProps) {
  return (
    <LayoutControlProvider>
      <AppShellLayout>{children}</AppShellLayout>
    </LayoutControlProvider>
  )
}

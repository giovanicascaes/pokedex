import { LayoutControlProvider } from "contexts"
import { AppShellProps } from "./app-shell.types"
import ShellLayout from "./shell-layout"

export default function AppShell({ children }: AppShellProps) {
  return (
    <LayoutControlProvider>
      <ShellLayout>{children}</ShellLayout>
    </LayoutControlProvider>
  )
}

import { AppShellProps } from "components"

export interface AppShellControlledScrollProps extends AppShellProps {
  enableScrollControl?: boolean
  preserveScroll?: string[]
}

export interface AppShellUseControlledScrollArgs {
  enable?: boolean
  reset?: boolean
  isPageLoaded?: boolean
  isPageTransitionRunning?: boolean
}

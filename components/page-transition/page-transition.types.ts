import { DetailedHTMLProps, HTMLAttributes } from "react"
import { WithNonLegacyRef } from "types"

export interface PageTransitionProps
  extends WithNonLegacyRef<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    HTMLDivElement
  > {
  keepHiddenOnNextTransition?: boolean
  onTransitionStart?: () => void
  onTransitionComplete?: () => void
}

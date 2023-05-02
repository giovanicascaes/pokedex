import { DetailedHTMLProps, HTMLAttributes } from "react"
import { WithNonLegacyRef } from "types"

export interface PageTransitionProps
  extends WithNonLegacyRef<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    HTMLDivElement
  > {
  imperativeFadeIn?: boolean
  onTransitionStart?: () => void
  onTransitionComplete?: () => void
}

export interface PageTransitionElement {
  resumeFade: () => void
}

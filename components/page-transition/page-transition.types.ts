import { DetailedHTMLProps, HTMLAttributes } from "react"
import { WithNonLegacyRef } from "types"

export interface PageTransitionProps
  extends WithNonLegacyRef<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    HTMLDivElement
  > {
  onTransitionStart?: () => void
  onTransitionComplete?: () => void
}

export interface PageTransitionElement {
  resume: () => void
}

export type PageTransitionStatus = "idle" | "fading-out" | "fading-in"

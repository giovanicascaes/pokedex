import { DetailedHTMLProps, HTMLAttributes } from "react"
import { WithNonLegacyRef } from "types"

export interface PageTransition2Props
  extends WithNonLegacyRef<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    HTMLDivElement
  > {
  imperativeFadeIn?: boolean
  onTransitionComplete?: () => void
}

export interface PageTransition2Element {
  start: () => void
}

export type PageTransition2Status = "idle" | "fading-out" | "fading-in"

import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react"
import { WithNonLegacyRef } from "types"

export interface TooltipProps
  extends WithNonLegacyRef<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    HTMLDivElement
  > {
  content: ReactNode
  shouldWrapChildren?: boolean
}

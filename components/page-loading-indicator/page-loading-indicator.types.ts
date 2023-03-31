import { DetailedHTMLProps, HTMLAttributes } from "react"
import { WithNonLegacyRef } from "types"

export type PageLoadingIndicatorProps = WithNonLegacyRef<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  HTMLDivElement
>

export type PageLoadingBarsProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

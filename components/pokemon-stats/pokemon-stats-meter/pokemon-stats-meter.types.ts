import { DetailedHTMLProps, HTMLAttributes } from "react"
import { WithRequired } from "types"

export interface PokemonStatsMeterProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  totalBars?: number
  value: number
  label: string
  barContainerClassName?: string
}

export type PokemonStatsMeterBarsProps = WithRequired<
  Omit<PokemonStatsMeterProps, "label" | "barContainerClassName">,
  "totalBars"
>

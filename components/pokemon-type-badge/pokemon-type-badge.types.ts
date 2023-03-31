import { DetailedHTMLProps, HTMLAttributes } from "react"

export interface PokemonTypeBadgeProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    "color"
  > {
  color: string | [string, string] | null
  doubleDamage?: boolean
}

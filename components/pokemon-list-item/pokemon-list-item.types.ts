import { DetailedHTMLProps, HTMLAttributes } from "react"
import { WithNonLegacyRef } from "types"

export interface PokemonListItemProps {
  identifier: number
  resourceName: string
  name: string
  artSrc: string | null
  animateArt?: boolean
  isOnPokedex?: boolean
  onCatchReleaseFinish?: () => void
}

export interface PokemonCaughtBadgeProps
  extends WithNonLegacyRef<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    HTMLDivElement
  > {
  isCaught: boolean
}

export type UsePokemonListItemArgs = Pick<
  PokemonListItemProps,
  "onCatchReleaseFinish" | "isOnPokedex"
>

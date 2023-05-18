import { DetailedHTMLProps, HTMLAttributes, ReactElement } from "react"
import { WithNonLegacyRef } from "types"

export type PokemonListItemAnimationState = "catching" | "releasing" | "idle"

export interface PokemonListItemChildrenFnProps {
  isAnimating: boolean
  animationState: PokemonListItemAnimationState
  onAnimationStart: () => void
  onAnimationFinish: () => void
}

export interface PokemonListItemProps {
  isOnPokedex?: boolean
  onAnimationFinish?: () => void
  children: (props: PokemonListItemChildrenFnProps) => ReactElement
}

export interface PokemonListItemViewProps {
  pokemonId: number
  resourceName: string
  name: string
  artSrc: string | null
  animateArt?: boolean
  isOnPokedex?: boolean
  onAnimationFinish: () => void
}

export interface PokemonCaughtBadgeProps
  extends WithNonLegacyRef<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    HTMLDivElement
  > {
  isCaught: boolean
}

import { DetailedHTMLProps, HTMLAttributes, ReactElement } from "react"

export interface PokemonCatchReleaseAnimationAnimateProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    "children" | "ref"
  > {
  children: ReactElement
}

export interface PokemonCatchReleaseAnimationImplProps
  extends PokemonCatchReleaseAnimationAnimateProps {
  pokemonRect: DOMRect
  onAnimationFinish?: () => void
}

export interface PokemonCatchReleaseAnimationChildrenFnProps {
  isAnimating: boolean
  runAnimation: () => void
}

export interface PokemonCatchReleaseAnimationProps {
  isOnPokedex: boolean
  onAnimationFinish?: () => void
  children: (props: PokemonCatchReleaseAnimationChildrenFnProps) => ReactElement
}

export interface PokemonCatchReleaseAnimationContextData {
  isAnimating: boolean
  isOnPokedex: boolean
}

export interface PokemonCatchReleaseAnimationContextActions {
  onAnimationFinish?: () => void
}

export type PokemonCatchReleaseAnimationContextValue = [
  PokemonCatchReleaseAnimationContextData,
  PokemonCatchReleaseAnimationContextActions
]

import { DetailedHTMLProps, HTMLAttributes, ReactElement } from "react"

export type PokemonCatchReleaseAnimationState =
  | "catching"
  | "releasing"
  | "idle"

export interface PokemonCatchReleaseAnimationWrapperProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    "children" | "ref"
  > {
  onAnimationFinish?: () => void
  children: ReactElement
}

export interface PokemonCatchReleaseAnimationStateProps
  extends Omit<PokemonCatchReleaseAnimationWrapperProps, "state"> {
  pokemonRect: DOMRect
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
  state: PokemonCatchReleaseAnimationState
}

export interface PokemonCatchReleaseAnimationContextActions {
  onAnimationFinish?: () => void
}

export type PokemonCatchReleaseAnimationContextValue = [
  PokemonCatchReleaseAnimationContextData,
  PokemonCatchReleaseAnimationContextActions
]

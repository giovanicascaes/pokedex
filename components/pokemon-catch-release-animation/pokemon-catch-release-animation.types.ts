import { DetailedHTMLProps, HTMLAttributes, ReactElement } from "react"

export type PokemonCatchReleaseAnimationState =
  | "catching"
  | "releasing"
  | "idle"
export interface PokemonCatchReleaseAnimationProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    "children" | "ref"
  > {
  state: PokemonCatchReleaseAnimationState
  onAnimationFinish?: () => void
  children: ReactElement
}

export interface PokemonCatchReleaseAnimationStateProps
  extends Omit<PokemonCatchReleaseAnimationProps, "state"> {
  pokemonRect: DOMRect
}

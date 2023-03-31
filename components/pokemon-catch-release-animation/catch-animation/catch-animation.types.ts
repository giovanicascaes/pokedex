import { PokemonCatchReleaseAnimationProps } from "../pokemon-catch-release-animation.types"

export interface CatchAnimationProps
  extends Omit<PokemonCatchReleaseAnimationProps, "isCaught"> {
  pokemonRect: DOMRect
}

export enum CatchAnimationPhase {
  MovingToCenter,
  Catching,
  MovingToPokedex,
}

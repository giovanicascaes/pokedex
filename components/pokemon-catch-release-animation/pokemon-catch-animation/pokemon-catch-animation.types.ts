import { PokemonCatchReleaseAnimationProps } from "../pokemon-catch-release-animation.types"

export interface PokemonCatchAnimationProps
  extends Omit<PokemonCatchReleaseAnimationProps, "isCaught"> {
  pokemonRect: DOMRect
}

export enum PokemonCatchAnimationPhase {
  MovingToCenter,
  Catching,
  MovingToPokedex,
}

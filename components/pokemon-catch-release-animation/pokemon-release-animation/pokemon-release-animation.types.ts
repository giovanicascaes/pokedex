import { PokemonCatchReleaseAnimationProps } from "../pokemon-catch-release-animation.types"

export interface PokemonReleaseAnimationProps
  extends Omit<PokemonCatchReleaseAnimationProps, "isCaught"> {
  pokemonRect: DOMRect
}

export enum PokemonReleaseAnimationPhase {
  MovingToCenter,
  Releasing,
  Fleeing,
}

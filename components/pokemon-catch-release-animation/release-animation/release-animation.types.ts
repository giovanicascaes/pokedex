import { PokemonCatchReleaseAnimationProps } from "../pokemon-catch-release-animation.types"

export interface ReleaseAnimationProps
  extends Omit<PokemonCatchReleaseAnimationProps, "isCaught"> {
  pokemonRect: DOMRect
}

export enum ReleaseAnimationPhase {
  MovingToCenter,
  Releasing,
  Fleeing,
}

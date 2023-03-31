import { PokemonActionAnimationProps } from "./pokemon-action-animation.types"
import PokemonCatchAnimation from "./pokemon-catch-animation"
import PokemonReleaseAnimation from "./pokemon-release-animation"

export const DEFAULT_CATCH_IMAGE_SIZE = 110

export const DEFAULT_RELEASE_IMAGE_SIZE = 110

export default function PokemonActionAnimation({
  isBeingCaught,
  catchSize = DEFAULT_CATCH_IMAGE_SIZE,
  releaseSize = DEFAULT_RELEASE_IMAGE_SIZE,
  ...other
}: PokemonActionAnimationProps) {
  return isBeingCaught ? (
    <PokemonCatchAnimation {...other} size={catchSize} />
  ) : (
    <PokemonReleaseAnimation {...other} size={releaseSize} />
  )
}

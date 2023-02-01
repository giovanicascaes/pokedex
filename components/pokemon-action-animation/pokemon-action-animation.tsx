import PokemonCatchAnimation from "./pokemon-catch-animation";
import { PokemonActionAnimationProps } from "./pokemon-action-animation.types";
import PokemonReleaseAnimation from "./pokemon-release-animation";

export default function PokemonActionAnimation({
  isBeingCaught,
  ...other
}: PokemonActionAnimationProps) {
  return isBeingCaught ? (
    <PokemonCatchAnimation {...other} />
  ) : (
    <PokemonReleaseAnimation {...other} />
  );
}

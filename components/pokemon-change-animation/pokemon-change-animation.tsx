import PokemonCatchAnimation from "./pokemon-catch-animation";
import { PokemonChangeAnimationProps } from "./pokemon-change-animation.types";
import PokemonReleaseAnimation from "./pokemon-release-animation";

export default function PokemonChangeAnimation({
  isBeingCaught,
  ...other
}: PokemonChangeAnimationProps) {
  return isBeingCaught ? (
    <PokemonCatchAnimation {...other} />
  ) : (
    <PokemonReleaseAnimation {...other} />
  );
}

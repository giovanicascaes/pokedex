import { PokemonCardProps } from "components";
import { PokemonSpeciesSimple } from "lib";

export interface ViewportAwarePokemonCardProps
  extends PokemonSpeciesSimple,
    Pick<
      PokemonCardProps,
      "animateArt" | "onPokemonChanged" | "canChange" | "isCaught"
    > {
  onIntersectionChange?: (isIntersecting: boolean, id: number) => void;
}

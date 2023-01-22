import { PokemonCardProps } from "components/pokemon-card";
import { PokemonSpeciesSimple } from "lib";

export interface ViewportAwarePokemonCardProps
  extends PokemonSpeciesSimple,
    Pick<PokemonCardProps, "animateArt" | "onCatchPokemon"> {
  onIntersectionChange?: (isIntersecting: boolean, id: number) => void;
}

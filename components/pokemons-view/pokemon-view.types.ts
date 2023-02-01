import { PokemonSpeciesSimple } from "lib";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface PokemonViewProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  pokemons: PokemonSpeciesSimple[];
  hiddenPokemons?: PokemonSpeciesSimple[];
  animateCards?: boolean;
  onListRendered?: () => void;
  onInitialAnimationsDone: () => void;
}

export type VisiblePokemonsProps = Pick<
  PokemonViewProps,
  "pokemons" | "animateCards" | "onListRendered" | "onInitialAnimationsDone"
>;

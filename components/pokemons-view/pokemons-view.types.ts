import { PokemonSpeciesSimple } from "lib";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface PokemonsViewProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  pokemons: PokemonSpeciesSimple[];
  hiddenPokemons?: PokemonSpeciesSimple[];
  animateCards?: boolean;
  onListRendered?: () => void;
  onInitialAnimationsDone: () => void;
}

export type VisiblePokemonsProps = Pick<
  PokemonsViewProps,
  "pokemons" | "animateCards" | "onListRendered" | "onInitialAnimationsDone"
>;

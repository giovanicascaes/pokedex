import { PokemonSpeciesSimple } from "lib";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface PokemonListProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  > {
  pokemons: PokemonSpeciesSimple[];
  hiddenPokemons?: PokemonSpeciesSimple[];
  animateCards?: boolean;
  onListRendered?: () => void;
}

export interface VisiblePokemonListProps {
  pokemons: PokemonSpeciesSimple[];
  animateCards: boolean;
  onListRendered?: () => void;
}

import { PokemonSpeciesSimple } from "lib";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export type PokemonGridPokemonListTuple = [PokemonSpeciesSimple[], PokemonSpeciesSimple[]];

export type PokemonGridPokemonList = PokemonSpeciesSimple[];

export interface PokemonGridProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  > {
  pokemons: PokemonGridPokemonList | PokemonGridPokemonListTuple;
  duration?: number;
}

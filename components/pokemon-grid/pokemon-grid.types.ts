import { PokemonSimple } from "lib";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export type PokemonGridPokemonListTuple = [PokemonSimple[], PokemonSimple[]];

export type PokemonGridPokemonList = PokemonSimple[];

export interface PokemonGridProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  pokemons: PokemonGridPokemonList | PokemonGridPokemonListTuple;
  duration?: number;
}

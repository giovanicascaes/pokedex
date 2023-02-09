import { PokemonSpeciesSimple } from "lib";
import { DetailedHTMLProps, HTMLAttributes, RefObject } from "react";

export interface PokemonGridProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  pokemons: PokemonSpeciesSimple[];
  columns: number;
}

export interface CatchingOrReleasingPokemon {
  id: number;
  artPosition: DOMRect;
  pokemonRef: RefObject<HTMLElement>;
}

export interface PokemonGridItemData extends PokemonSpeciesSimple {
  x: number;
  y: number;
  measureOnly?: boolean;
}

export type PokemonGridData = readonly [
  { width: number; height: number },
  PokemonGridItemData[]
];

import { PokemonSpeciesSimple } from "lib";
import { DetailedHTMLProps, HTMLAttributes, Ref } from "react";

export interface PokemonListProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
    "ref"
  > {
  // `react-spring`'s `animated` api doesn't support legacy ref api (`string` type)
  ref?: Ref<HTMLUListElement>;
  pokemons: PokemonSpeciesSimple[];
}

export interface CatchingOrReleasingPokemonList {
  id: number;
  artPosition: DOMRect;
}

export interface PokemonListItemData extends PokemonSpeciesSimple {
  y: number;
  measureOnly?: boolean;
}

export type PokemonListData = readonly [
  { height: number },
  PokemonListItemData[]
];

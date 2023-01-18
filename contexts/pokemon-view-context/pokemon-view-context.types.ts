import { PokemonSpeciesDetailed, PokemonSpeciesSimple } from "lib";
import { ReactNode } from "react";

export enum PokemonViewActionTypes {
  SetViewingPokemon,
  ClearViewingPokemon,
}

export interface PokemonViewContextData {
  currentPage: number;
  visiblePokemons: PokemonSpeciesSimple[];
  hiddenPokemons: PokemonSpeciesSimple[];
  viewingPokemon: PokemonSpeciesDetailed | null;
  hasFetchedAll: boolean;
  isPokemonListRendered: boolean;
  isPokemonListScrollEnabled: boolean;
}

export interface PokemonViewContextActions {
  loadMore: () => void;
  setViewingPokemon: (pokemon: PokemonSpeciesDetailed) => void;
  clearViewingPokemon: () => void;
  onPokemonListRendered: () => void;
  onPokemonListScrollRestored: () => void;
}

export type PokemonViewContextValue = [
  PokemonViewContextData,
  PokemonViewContextActions
];

export interface PokemonViewProviderProps {
  children: ReactNode;
}

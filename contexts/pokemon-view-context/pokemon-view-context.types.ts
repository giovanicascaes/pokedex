import { PokemonSpeciesDetailed, PokemonSpeciesSimple } from "lib";
import { ReactNode } from "react";

export enum PokemonViewActionTypes {
  SetViewingPokemon,
  ClearViewingPokemon,
  SetPokemonListRendered,
  SetPokemonListScrollDisabled,
  AddPokemonToPokedex,
  RemovePokemonFromPokedex,
}

export interface PokmeonViewState {
  viewingPokemon: PokemonSpeciesDetailed | null;
  isPokemonListRendered: boolean;
  isPokemonListScrollDisabled: boolean;
  pokedex: PokemonSpeciesSimple[];
}

export type PokmeonViewActions =
  | {
      type: PokemonViewActionTypes.SetViewingPokemon;
      pokemon: PokemonSpeciesDetailed;
    }
  | {
      type: PokemonViewActionTypes.ClearViewingPokemon;
    }
  | {
      type: PokemonViewActionTypes.SetPokemonListRendered;
      rendered: boolean;
    }
  | {
      type: PokemonViewActionTypes.SetPokemonListScrollDisabled;
      disabled: boolean;
    }
  | {
      type: PokemonViewActionTypes.AddPokemonToPokedex;
      pokemon: PokemonSpeciesSimple;
    }
  | {
      type: PokemonViewActionTypes.RemovePokemonFromPokedex;
      id: number;
    };

export interface PokemonViewContextData {
  currentPage: number;
  visiblePokemons: PokemonSpeciesSimple[];
  hiddenPokemons: PokemonSpeciesSimple[];
  pokedex: PokemonSpeciesSimple[];
  viewingPokemon: PokemonSpeciesDetailed | null;
  hasFetchedAll: boolean;
  isPokemonListRendered: boolean;
  isPokemonListScrollDisabled: boolean;
}

export interface PokemonViewContextActions {
  loadMore: () => void;
  setViewingPokemon: (pokemon: PokemonSpeciesDetailed) => void;
  clearViewingPokemon: () => void;
  onPokemonListRendered: () => void;
  onPokemonListScrollRestored: () => void;
  addPokemonToPokedex: (pokemon: PokemonSpeciesSimple) => void;
  removePokemonFromPokedex: (id: number) => void;
}

export type PokemonViewContextValue = [
  PokemonViewContextData,
  PokemonViewContextActions
];

export interface PokemonViewProviderProps {
  children: ReactNode;
}

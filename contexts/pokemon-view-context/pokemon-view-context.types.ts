import { PokemonSpeciesDetailed, PokemonSpeciesSimple } from "lib"
import { ReactNode } from "react"

export enum PokemonViewActionTypes {
  DirtyScroll,
  SetViewingPokemon,
  ClearViewingPokemon,
  AddPokemonToPokedex,
  RemovePokemonFromPokedex,
}

export interface PokmeonViewState {
  isScrollDirty: boolean
  viewingPokemon: PokemonSpeciesDetailed | null
  pokedex: PokemonSpeciesSimple[]
}

export type PokmeonViewActions =
  | {
      type: PokemonViewActionTypes.DirtyScroll
    }
  | {
      type: PokemonViewActionTypes.SetViewingPokemon
      pokemon: PokemonSpeciesDetailed
    }
  | {
      type: PokemonViewActionTypes.ClearViewingPokemon
    }
  | {
      type: PokemonViewActionTypes.AddPokemonToPokedex
      pokemon: PokemonSpeciesSimple
    }
  | {
      type: PokemonViewActionTypes.RemovePokemonFromPokedex
      id: number
    }

export interface PokemonViewContextData {
  currentPage: number
  visiblePokemons: PokemonSpeciesSimple[]
  hiddenPokemons: PokemonSpeciesSimple[]
  pokedex: PokemonSpeciesSimple[]
  viewingPokemon: PokemonSpeciesDetailed | null
  hasFetchedAll: boolean
  isScrollDirty: boolean
}

export interface PokemonViewContextActions {
  loadMore: () => void
  dirtyScroll: () => void
  setViewingPokemon: (pokemon: PokemonSpeciesDetailed) => void
  clearViewingPokemon: () => void
  addPokemonToPokedex: (pokemon: PokemonSpeciesSimple) => void
  removePokemonFromPokedex: (id: number) => void
}

export type PokemonViewContextValue = [
  PokemonViewContextData,
  PokemonViewContextActions
]

export interface PokemonViewProviderProps {
  children: ReactNode
}

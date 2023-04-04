import { PokemonSpeciesDetailed, PokemonSpeciesSimple } from "lib"
import { ReactNode } from "react"

export enum PokemonViewActionTypes {
  DirtyScroll,
  SetViewingPokemon,
  ClearViewingPokemon,
  AddPokemonToPokedex,
  RemovePokemonFromPokedex,
}

export interface PokemonSpeciesPokedex extends PokemonSpeciesSimple {
  isOnPokedex: boolean
}

export interface PokemonViewState {
  isScrollDirty: boolean
  viewingPokemon: PokemonSpeciesDetailed | null
  pokedex: PokemonSpeciesPokedex[]
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
      pokemon: PokemonSpeciesPokedex
    }
  | {
      type: PokemonViewActionTypes.RemovePokemonFromPokedex
      id: number
    }

export interface PokemonViewContextData {
  currentPage: number
  visiblePokemons: PokemonSpeciesPokedex[]
  preloadPokemons: PokemonSpeciesPokedex[]
  pokedex: PokemonSpeciesPokedex[]
  viewingPokemon: PokemonSpeciesDetailed | null
  hasFetchedAll: boolean
  isScrollDirty: boolean
}

export interface PokemonViewContextActions {
  loadMore: () => void
  dirtyScroll: () => void
  setViewingPokemon: (pokemon: PokemonSpeciesDetailed) => void
  clearViewingPokemon: () => void
  addPokemonToPokedex: (pokemon: PokemonSpeciesPokedex) => void
  removePokemonFromPokedex: (id: number) => void
}

export type PokemonViewContextValue = [
  PokemonViewContextData,
  PokemonViewContextActions
]

export interface PokemonViewProviderProps {
  children: ReactNode
}

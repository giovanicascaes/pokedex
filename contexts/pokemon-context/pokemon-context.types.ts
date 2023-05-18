import { PokemonSpeciesDetailed, PokemonSpeciesSimple } from "lib"
import { ReactNode } from "react"

export enum PokemonActionTypes {
  SetViewingPokemon,
  ClearViewingPokemon,
  AddPokemonToPokedex,
  RemovePokemonFromPokedex,
}

export interface PokemonSpeciesPokedex extends PokemonSpeciesSimple {
  isOnPokedex?: boolean
}

export interface PokemonState {
  viewingPokemon: PokemonSpeciesDetailed | null
  pokedex: PokemonSpeciesPokedex[]
}

export type PokemonActions =
  | {
      type: PokemonActionTypes.SetViewingPokemon
      pokemon: PokemonSpeciesDetailed
    }
  | {
      type: PokemonActionTypes.ClearViewingPokemon
    }
  | {
      type: PokemonActionTypes.AddPokemonToPokedex
      pokemon: PokemonSpeciesPokedex
    }
  | {
      type: PokemonActionTypes.RemovePokemonFromPokedex
      id: number
    }

export interface PokemonContextData {
  currentPage: number
  visible: PokemonSpeciesPokedex[]
  preload: PokemonSpeciesPokedex[]
  pokedex: PokemonSpeciesPokedex[]
  viewingPokemon: PokemonSpeciesDetailed | null
  hasFetchedAll: boolean
}

export interface PokemonContextActions {
  loadMore: () => void
  setViewingPokemon: (pokemon: PokemonSpeciesDetailed) => void
  clearViewingPokemon: () => void
  addPokemonToPokedex: (pokemon: PokemonSpeciesPokedex) => void
  removePokemonFromPokedex: (id: number) => void
}

export type PokemonContextValue = [PokemonContextData, PokemonContextActions]

export interface PokemonProviderProps {
  children: ReactNode
}

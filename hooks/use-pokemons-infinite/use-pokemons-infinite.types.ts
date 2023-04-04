import { PokemonSpeciesSimple } from "lib"

export type UsePokemonInfiniteArgs = number

export type UsePokemonInfinitePokemons = [
  PokemonSpeciesSimple[],
  PokemonSpeciesSimple[]
]

export interface UsePokemonInfiniteReturn {
  currentPage: number
  pokemons: UsePokemonInfinitePokemons
  isLoadingMore: boolean
  hasFetchedAll: boolean
  error: any
  loadNext: () => void
}

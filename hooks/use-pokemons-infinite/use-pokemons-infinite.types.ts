import { PokemonSpeciesSimple } from "lib";

export type UsePokemonListArgs = number;

export interface UsePokemonListReturn {
  currentPage: number;
  pages: [PokemonSpeciesSimple[], PokemonSpeciesSimple[]];
  isLoadingMore: boolean;
  hasFetchedAll: boolean;
  error: any;
  loadNext: () => void;
}

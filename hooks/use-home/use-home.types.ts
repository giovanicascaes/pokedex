import { PokemonSpeciesSimple } from "lib";

export type UseHomeArgs = number;

export interface UseHomeReturn {
  pages: [PokemonSpeciesSimple[], PokemonSpeciesSimple[]];
  isLoadingMore: boolean;
  hasReachedEnd: boolean;
  error: any;
  loadNext: () => void;
}

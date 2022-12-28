import { PokemonSimple } from "lib";

export type UseHomeArgs = number;

export interface UseHomeReturn {
  pages: [PokemonSimple[], PokemonSimple[]];
  isLoadingMore: boolean;
  error: any;
  loadNext: () => void;
}

import { server } from "lib";

export type UseHomeArgs = number;

export interface UseHomeReturn {
  pages: [
    server.PokemonSimple[],
    server.PokemonSimple[],
    server.PokemonSimple[]
  ];
  isLoadingMore: boolean;
  error: any;
  loadNext: () => void;
}

import { createContext } from "utils"
import { PokemonListContextValue } from "./pokemon-list.types"

export const [PokemonListProvider, usePokemonList] =
  createContext<PokemonListContextValue>({
    hookName: "usePokemonList",
    providerName: "PokemonListProvider",
  })

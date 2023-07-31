import { createContext } from "utils"
import { PokemonCatchReleaseAnimationContextValue } from "./pokemon-catch-release-animation.types"

export const [
  PokemonCatchReleaseAnimationProvider,
  usePokemonCatchReleaseAnimation,
] = createContext<PokemonCatchReleaseAnimationContextValue>({
  hookName: "usePokemonCatchReleaseAnimation",
  providerName: "PokemonCatchReleaseAnimationProvider",
})

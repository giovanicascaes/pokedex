import { usePokemonsInfinite, usePrevious } from "hooks";
import { PokemonSpeciesDetailed } from "lib";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { createContext } from "utils";
import {
  PokemonViewContextActions,
  PokemonViewContextData,
  PokemonViewContextValue,
  PokemonViewProviderProps,
} from "./pokemon-view-context.types";

export const POKEMONS_PER_PAGE = 12;

const [Provider, useContext] = createContext<PokemonViewContextValue>({
  hookName: "usePokemonView",
  providerName: "PokemonViewProvider",
});

export const usePokemonView = useContext;

export function PokemonViewProvider({ children }: PokemonViewProviderProps) {
  const [isPokemonListRendered, setIsPokemonListRendered] = useState(false);
  const [isPokemonListScrollEnabled, setIsPokemonListScrollEnabled] =
    useState(true);
  const [viewingPokemon, setViewingPokemon] =
    useState<PokemonSpeciesDetailed | null>(null);
  const { pathname } = useRouter();
  const prevPathName = usePrevious(pathname);
  const {
    currentPage,
    pages: [visiblePokemons, hiddenPokemons],
    hasFetchedAll,
    error,
    loadNext,
  } = usePokemonsInfinite(POKEMONS_PER_PAGE);

  useEffect(() => {
    if (pathname === "/" && prevPathName && prevPathName !== pathname) {
      setIsPokemonListRendered(false);
      setIsPokemonListScrollEnabled(false);
    }
  }, [pathname, prevPathName]);

  const data: PokemonViewContextData = {
    currentPage,
    viewingPokemon,
    visiblePokemons,
    hiddenPokemons,
    hasFetchedAll,
    isPokemonListRendered,
    isPokemonListScrollEnabled,
  };

  const actions: PokemonViewContextActions = useMemo(
    () => ({
      loadMore: loadNext,
      setViewingPokemon,
      clearViewingPokemon() {
        setViewingPokemon(null);
      },
      onPokemonListRendered() {
        setIsPokemonListRendered(true);
      },
      onPokemonListScrollRestored() {
        setIsPokemonListScrollEnabled(true);
      },
    }),
    [loadNext]
  );

  return <Provider value={[data, actions]}>{children}</Provider>;
}

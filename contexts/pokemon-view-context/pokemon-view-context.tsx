import { usePokemonsInfinite, usePrevious } from "hooks";
import { PokemonSpeciesDetailed, PokemonSpeciesSimple } from "lib";
import { useRouter } from "next/router";
import { useEffect, useMemo, useReducer } from "react";
import { createContext } from "utils";
import {
  PokemonViewActionTypes,
  PokemonViewContextActions,
  PokemonViewContextData,
  PokemonViewContextValue,
  PokemonViewProviderProps,
  PokmeonViewActions,
  PokmeonViewState,
} from "./pokemon-view-context.types";

export const POKEMONS_PER_PAGE = 12;

const [Provider, useContext] = createContext<PokemonViewContextValue>({
  hookName: "usePokemonView",
  providerName: "PokemonViewProvider",
});

export const usePokemonView = useContext;

const reducers: {
  [P in PokemonViewActionTypes]: (
    state: PokmeonViewState,
    action: Extract<PokmeonViewActions, { type: P }>
  ) => PokmeonViewState;
} = {
  [PokemonViewActionTypes.SetViewingPokemon](state, action) {
    return { ...state, viewingPokemon: action.pokemon };
  },
  [PokemonViewActionTypes.ClearViewingPokemon](state) {
    return { ...state, viewingPokemon: null };
  },
  [PokemonViewActionTypes.SetPokemonListRendered](state, action) {
    return { ...state, isPokemonListRendered: action.rendered };
  },
  [PokemonViewActionTypes.SetPokemonListScrollEnabled](state, action) {
    return { ...state, isPokemonListScrollEnabled: action.enabled };
  },
  [PokemonViewActionTypes.AddPokemonToPokedex](state, action) {
    return { ...state, pokedex: [...state.pokedex, action.pokemon] };
  },
  [PokemonViewActionTypes.RemovePokemonFromPokedex](state, action) {
    return {
      ...state,
      pokedex: state.pokedex.filter((pokemon) => pokemon.id !== action.id),
    };
  },
};

function matchReducer(
  state: PokmeonViewState,
  action: PokmeonViewActions
): PokmeonViewState {
  const reducer = reducers as Record<
    PokemonViewActionTypes,
    (state: PokmeonViewState, action: PokmeonViewActions) => PokmeonViewState
  >;
  return reducer[action.type](state, action);
}

const INITIAL_STATE: PokmeonViewState = {
  isPokemonListRendered: false,
  isPokemonListScrollEnabled: true,
  viewingPokemon: null,
  pokedex: [],
};

export function PokemonViewProvider({ children }: PokemonViewProviderProps) {
  const [state, dispatch] = useReducer(matchReducer, INITIAL_STATE);
  const { pathname } = useRouter();
  const prevPathName = usePrevious(pathname);
  const {
    currentPage,
    pages: [visiblePokemons, hiddenPokemons],
    hasFetchedAll,
    error,
    loadNext: loadMore,
  } = usePokemonsInfinite(POKEMONS_PER_PAGE);

  useEffect(() => {
    if (pathname === "/" && prevPathName && prevPathName !== pathname) {
      dispatch({
        type: PokemonViewActionTypes.SetPokemonListRendered,
        rendered: false,
      });
      dispatch({
        type: PokemonViewActionTypes.SetPokemonListScrollEnabled,
        enabled: false,
      });
    }
  }, [pathname, prevPathName]);

  const data: PokemonViewContextData = {
    ...state,
    currentPage,
    visiblePokemons,
    hiddenPokemons,
    hasFetchedAll,
  };

  const actions: PokemonViewContextActions = useMemo(
    () => ({
      loadMore,
      setViewingPokemon(pokemon: PokemonSpeciesDetailed) {
        dispatch({
          type: PokemonViewActionTypes.SetViewingPokemon,
          pokemon,
        });
      },
      clearViewingPokemon() {
        dispatch({
          type: PokemonViewActionTypes.ClearViewingPokemon,
        });
      },
      onPokemonListRendered() {
        dispatch({
          type: PokemonViewActionTypes.SetPokemonListRendered,
          rendered: true,
        });
      },
      onPokemonListScrollRestored() {
        dispatch({
          type: PokemonViewActionTypes.SetPokemonListScrollEnabled,
          enabled: true,
        });
      },
      addPokemonToPokedex(pokemon: PokemonSpeciesSimple) {
        dispatch({
          type: PokemonViewActionTypes.AddPokemonToPokedex,
          pokemon,
        });
      },
      removePokemonFromPokedex(id: number) {
        dispatch({
          type: PokemonViewActionTypes.RemovePokemonFromPokedex,
          id,
        });
      },
    }),
    [loadMore]
  );

  return <Provider value={[data, actions]}>{children}</Provider>;
}

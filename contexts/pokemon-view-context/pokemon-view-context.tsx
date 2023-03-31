import { usePokemonsInfinite, usePrevious } from "hooks"
import { PokemonSpeciesDetailed, PokemonSpeciesSimple } from "lib"
import { useRouter } from "next/router"
import { useMemo, useReducer } from "react"
import { createContext } from "utils"
import {
  PokemonViewActionTypes,
  PokemonViewContextActions,
  PokemonViewContextData,
  PokemonViewContextValue,
  PokemonViewProviderProps,
  PokmeonViewActions,
  PokmeonViewState,
} from "./pokemon-view-context.types"

export const POKEMONS_PER_PAGE = 12

const [Provider, useContext] = createContext<PokemonViewContextValue>({
  hookName: "usePokemonView",
  providerName: "PokemonViewProvider",
})

export const usePokemonView = useContext

const reducers: {
  [P in PokemonViewActionTypes]: (
    state: PokmeonViewState,
    action: Extract<PokmeonViewActions, { type: P }>
  ) => PokmeonViewState
} = {
  [PokemonViewActionTypes.DirtyScroll](state) {
    return { ...state, isScrollDirty: true }
  },
  [PokemonViewActionTypes.SetViewingPokemon](state, action) {
    return { ...state, viewingPokemon: action.pokemon }
  },
  [PokemonViewActionTypes.ClearViewingPokemon](state) {
    return { ...state, viewingPokemon: null }
  },
  [PokemonViewActionTypes.AddPokemonToPokedex](state, action) {
    return { ...state, pokedex: [...state.pokedex, action.pokemon] }
  },
  [PokemonViewActionTypes.RemovePokemonFromPokedex](state, action) {
    return {
      ...state,
      pokedex: state.pokedex.filter((pokemon) => pokemon.id !== action.id),
    }
  },
}

function matchReducer(
  state: PokmeonViewState,
  action: PokmeonViewActions
): PokmeonViewState {
  const reducer = reducers as Record<
    PokemonViewActionTypes,
    (state: PokmeonViewState, action: PokmeonViewActions) => PokmeonViewState
  >
  return reducer[action.type](state, action)
}

const INITIAL_STATE: PokmeonViewState = {
  isScrollDirty: false,
  viewingPokemon: null,
  pokedex: [],
}

export function PokemonViewProvider({ children }: PokemonViewProviderProps) {
  const [state, dispatch] = useReducer(matchReducer, INITIAL_STATE)
  const { pathname } = useRouter()
  const prevPathName = usePrevious(pathname)
  const {
    currentPage,
    pages: [visiblePokemons, hiddenPokemons],
    hasFetchedAll,
    error,
    loadNext: loadMore,
  } = usePokemonsInfinite(POKEMONS_PER_PAGE)

  const data: PokemonViewContextData = {
    ...state,
    currentPage,
    visiblePokemons,
    hiddenPokemons,
    hasFetchedAll,
  }

  const actions: PokemonViewContextActions = useMemo(
    () => ({
      loadMore,
      dirtyScroll() {
        dispatch({
          type: PokemonViewActionTypes.DirtyScroll,
        })
      },
      setViewingPokemon(pokemon: PokemonSpeciesDetailed) {
        dispatch({
          type: PokemonViewActionTypes.SetViewingPokemon,
          pokemon,
        })
      },
      clearViewingPokemon() {
        dispatch({
          type: PokemonViewActionTypes.ClearViewingPokemon,
        })
      },
      addPokemonToPokedex(pokemon: PokemonSpeciesSimple) {
        dispatch({
          type: PokemonViewActionTypes.AddPokemonToPokedex,
          pokemon,
        })
      },
      removePokemonFromPokedex(id: number) {
        dispatch({
          type: PokemonViewActionTypes.RemovePokemonFromPokedex,
          id,
        })
      },
    }),
    [loadMore]
  )

  return <Provider value={[data, actions]}>{children}</Provider>
}

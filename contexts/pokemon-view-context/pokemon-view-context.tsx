import { usePokemonsInfinite } from "hooks"
import { PokemonSpeciesDetailed, PokemonSpeciesSimple } from "lib"
import { useMemo, useReducer } from "react"
import { createContext } from "utils"
import {
  PokemonSpeciesPokedex,
  PokemonViewActionTypes,
  PokemonViewContextActions,
  PokemonViewContextData,
  PokemonViewContextValue,
  PokemonViewProviderProps,
  PokemonViewState,
  PokmeonViewActions,
} from "./pokemon-view-context.types"

export const POKEMONS_PER_PAGE = 12

const mapWithOnPokedexState = (
  pokemons: PokemonSpeciesSimple[],
  pokedex: PokemonSpeciesPokedex[]
) =>
  pokemons.map((pokemon) => ({
    ...pokemon,
    isOnPokedex: pokedex.some(({ id }) => id === pokemon.id),
  }))

const [Provider, useContext] = createContext<PokemonViewContextValue>({
  hookName: "usePokemonView",
  providerName: "PokemonViewProvider",
})

export function usePokemonView(
  serverLoadedPokemons: PokemonSpeciesSimple[] = []
) {
  const [data, actions] = useContext()

  return [
    {
      ...data,
      visiblePokemons: useMemo(
        () => [
          ...mapWithOnPokedexState(serverLoadedPokemons, data.pokedex),
          ...data.visiblePokemons,
        ],
        [data.pokedex, data.visiblePokemons, serverLoadedPokemons]
      ),
    },
    actions,
  ] as PokemonViewContextValue
}

const reducers: {
  [P in PokemonViewActionTypes]: (
    state: PokemonViewState,
    action: Extract<PokmeonViewActions, { type: P }>
  ) => PokemonViewState
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
  state: PokemonViewState,
  action: PokmeonViewActions
): PokemonViewState {
  const reducer = reducers as Record<
    PokemonViewActionTypes,
    (state: PokemonViewState, action: PokmeonViewActions) => PokemonViewState
  >
  return reducer[action.type](state, action)
}

const INITIAL_STATE: PokemonViewState = {
  isScrollDirty: false,
  viewingPokemon: null,
  pokedex: [],
}

export function PokemonViewProvider({ children }: PokemonViewProviderProps) {
  const [state, dispatch] = useReducer(matchReducer, INITIAL_STATE)
  const {
    currentPage,
    pokemons: [visiblePokemons, preloadPokemons],
    hasFetchedAll,
    error,
    loadNext: loadMore,
  } = usePokemonsInfinite(POKEMONS_PER_PAGE)

  const data: PokemonViewContextData = useMemo(
    () => ({
      ...state,
      currentPage,
      visiblePokemons: mapWithOnPokedexState(visiblePokemons, state.pokedex),
      preloadPokemons: mapWithOnPokedexState(preloadPokemons, state.pokedex),
      hasFetchedAll,
    }),
    [currentPage, hasFetchedAll, preloadPokemons, state, visiblePokemons]
  )

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
      addPokemonToPokedex(pokemon: PokemonSpeciesPokedex) {
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

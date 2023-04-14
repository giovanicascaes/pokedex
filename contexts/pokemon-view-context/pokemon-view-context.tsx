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
  PokemonViewActions,
} from "./pokemon-view-context.types"

export const POKEMONS_PER_PAGE = 12

const mapWithOnPokedexState = (
  pokemons: PokemonSpeciesSimple[],
  pokedex: PokemonSpeciesPokedex[]
) =>
  pokemons.map((pokemon) => ({
    ...pokemon,
    onPokedex: pokedex.some(({ id }) => id === pokemon.id),
  }))

const [Provider, useContext] = createContext<PokemonViewContextValue>({
  hookName: "usePokemonView",
  providerName: "PokemonViewProvider",
})

export function usePokemonView(
  serverLoadedPokemons: PokemonSpeciesSimple[] = []
) {
  const [data, actions] = useContext()

  return useMemo<PokemonViewContextValue>(
    () => [
      {
        ...data,
        visiblePokemons: [
          ...mapWithOnPokedexState(serverLoadedPokemons, data.pokedex),
          ...data.visiblePokemons,
        ],
      },
      actions,
    ],
    [actions, data, serverLoadedPokemons]
  )
}

const reducers: {
  [P in PokemonViewActionTypes]: (
    state: PokemonViewState,
    action: Extract<PokemonViewActions, { type: P }>
  ) => PokemonViewState
} = {
  [PokemonViewActionTypes.SetViewingPokemon](state, action) {
    return { ...state, viewingPokemon: action.pokemon }
  },
  [PokemonViewActionTypes.ClearViewingPokemon](state) {
    return { ...state, viewingPokemon: null }
  },
  [PokemonViewActionTypes.AddPokemonToPokedex](state, action) {
    return {
      ...state,
      pokedex: [...state.pokedex, { ...action.pokemon, onPokedex: true }],
    }
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
  action: PokemonViewActions
): PokemonViewState {
  const reducer = reducers as Record<
    PokemonViewActionTypes,
    (state: PokemonViewState, action: PokemonViewActions) => PokemonViewState
  >
  return reducer[action.type](state, action)
}

const INITIAL_STATE: PokemonViewState = {
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

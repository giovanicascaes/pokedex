import { usePokemonsInfinite } from "hooks"
import { PokemonSpeciesDetailed, PokemonSpeciesSimple } from "lib"
import { useMemo, useReducer } from "react"
import { createContext } from "utils"
import {
  PokemonSpeciesPokedex,
  PokemonActionTypes,
  PokemonContextActions,
  PokemonContextData,
  PokemonContextValue,
  PokemonProviderProps,
  PokemonState,
  PokemonActions,
} from "./pokemon-context.types"

export const POKEMONS_PER_PAGE = 12

const addPokedexState = (
  pokemons: PokemonSpeciesSimple[],
  pokedex: PokemonSpeciesPokedex[]
) =>
  pokemons.map((pokemon) => ({
    ...pokemon,
    isOnPokedex: pokedex.some(({ id }) => id === pokemon.id),
  }))

const [Provider, useContext] = createContext<PokemonContextValue>({
  hookName: "usePokemon",
  providerName: "PokemonProvider",
})

export function usePokemon(serverLoadedPokemons: PokemonSpeciesSimple[] = []) {
  const [data, actions] = useContext()

  return useMemo<PokemonContextValue>(
    () => [
      {
        ...data,
        visible: [
          ...addPokedexState(serverLoadedPokemons, data.pokedex),
          ...data.visible,
        ],
      },
      actions,
    ],
    [actions, data, serverLoadedPokemons]
  )
}

const reducers: {
  [P in PokemonActionTypes]: (
    state: PokemonState,
    action: Extract<PokemonActions, { type: P }>
  ) => PokemonState
} = {
  [PokemonActionTypes.SetViewingPokemon](state, action) {
    return { ...state, viewingPokemon: action.pokemon }
  },
  [PokemonActionTypes.ClearViewingPokemon](state) {
    return { ...state, viewingPokemon: null }
  },
  [PokemonActionTypes.AddPokemonToPokedex](state, action) {
    return {
      ...state,
      pokedex: [...state.pokedex, { ...action.pokemon, isOnPokedex: true }],
    }
  },
  [PokemonActionTypes.RemoveFromPokedex](state, action) {
    return {
      ...state,
      pokedex: state.pokedex.filter((pokemon) => pokemon.id !== action.id),
    }
  },
}

function matchReducer(
  state: PokemonState,
  action: PokemonActions
): PokemonState {
  const reducer = reducers as Record<
    PokemonActionTypes,
    (state: PokemonState, action: PokemonActions) => PokemonState
  >
  return reducer[action.type](state, action)
}

const INITIAL_STATE: PokemonState = {
  viewingPokemon: null,
  pokedex: [],
}

export function PokemonProvider({ children }: PokemonProviderProps) {
  const [state, dispatch] = useReducer(matchReducer, INITIAL_STATE)
  const {
    currentPage,
    pokemons: [visible, preload],
    hasFetchedAll,
    error,
    loadNext: loadMore,
  } = usePokemonsInfinite(POKEMONS_PER_PAGE)

  const data: PokemonContextData = useMemo(
    () => ({
      ...state,
      currentPage,
      visible: addPokedexState(visible, state.pokedex),
      preload: addPokedexState(preload, state.pokedex),
      hasFetchedAll,
    }),
    [currentPage, hasFetchedAll, preload, state, visible]
  )

  const actions: PokemonContextActions = useMemo(
    () => ({
      loadMore,
      setViewingPokemon(pokemon: PokemonSpeciesDetailed) {
        dispatch({
          type: PokemonActionTypes.SetViewingPokemon,
          pokemon,
        })
      },
      clearViewingPokemon() {
        dispatch({
          type: PokemonActionTypes.ClearViewingPokemon,
        })
      },
      addPokemonToPokedex(pokemon: PokemonSpeciesPokedex) {
        dispatch({
          type: PokemonActionTypes.AddPokemonToPokedex,
          pokemon,
        })
      },
      removeFromPokedex(id: number) {
        dispatch({
          type: PokemonActionTypes.RemoveFromPokedex,
          id,
        })
      },
    }),
    [loadMore]
  )

  return <Provider value={[data, actions]}>{children}</Provider>
}

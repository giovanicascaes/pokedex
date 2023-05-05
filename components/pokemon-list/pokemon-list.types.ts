import { PokemonSpeciesPokedex } from "contexts"
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react"
import { WithNonLegacyRef } from "types"

export interface PokemonListProps
  extends WithNonLegacyRef<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    HTMLDivElement
  > {
  pokemons: PokemonSpeciesPokedex[]
  preloadPokemons?: PokemonSpeciesPokedex[]
  skipFirstPokemonsAnimation?: boolean
  onAddToPokedex?: (pokemon: PokemonSpeciesPokedex) => void
  onRemoveFromPokedex: (id: number) => void
  onLoad?: () => void
}

export type PokemonListViewProps = Pick<
  PokemonListProps,
  | "pokemons"
  | "preloadPokemons"
  | "skipFirstPokemonsAnimation"
  | "onAddToPokedex"
  | "onRemoveFromPokedex"
  | "onLoad"
>

interface PokemonListItemAnimationValuesLookup<T = any> {
  [key: string]: T
}

export interface PokemonListItemAnimationValues {
  from: PokemonListItemAnimationValuesLookup
  to: PokemonListItemAnimationValuesLookup
  leave: PokemonListItemAnimationValuesLookup
}

export interface PokemonListItemAnimationProperties {
  trail: number
  duration: number
  values: PokemonListItemAnimationValues
}

export interface UsePokemonListViewArgs
  extends Pick<
    PokemonListProps,
    | "pokemons"
    | "skipFirstPokemonsAnimation"
    | "onAddToPokedex"
    | "onRemoveFromPokedex"
    | "onLoad"
  > {
  animationProperties: PokemonListItemAnimationProperties
}

export interface PokemonListItemAnimationRunToken {
  cancel?: () => void
}

export type PokemonListContextData = Pick<
  PokemonListProps,
  "pokemons" | "preloadPokemons" | "skipFirstPokemonsAnimation"
>

export type PokemonListContextActions = Pick<
  PokemonListProps,
  "onAddToPokedex" | "onRemoveFromPokedex" | "onLoad"
>

export type PokemonListContextValue = [
  PokemonListContextData,
  PokemonListContextActions
]

export interface PokemonListProviderProps {
  children: ReactNode
}

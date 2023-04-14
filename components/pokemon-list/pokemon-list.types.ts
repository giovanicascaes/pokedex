import { PokemonSpeciesPokedex } from "contexts"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { WithNonLegacyRef } from "types"

export interface PokemonListProps
  extends WithNonLegacyRef<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    HTMLDivElement
  > {
  pokemons: PokemonSpeciesPokedex[]
  preloadPokemons?: PokemonSpeciesPokedex[]
  skipInitialAnimation?: boolean
  onAddToPokedex?: (pokemon: PokemonSpeciesPokedex) => void
  onRemoveFromPokedex: (id: number) => void
  onReady?: () => void
}

export type PokemonListViewProps = Pick<
  PokemonListProps,
  | "pokemons"
  | "preloadPokemons"
  | "skipInitialAnimation"
  | "onAddToPokedex"
  | "onRemoveFromPokedex"
  | "onReady"
>

export interface PokemonListItemAnimationValues {
  from: PokemonListItemAnimationValuesLookup
  to: PokemonListItemAnimationValuesLookup
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
    | "skipInitialAnimation"
    | "onAddToPokedex"
    | "onRemoveFromPokedex"
    | "onReady"
  > {
  animationProperties: PokemonListItemAnimationProperties
}

export interface PokemonListItemAnimationRunToken {
  cancel?: () => void
}

interface PokemonListItemAnimationValuesLookup<T = any> {
  [key: string]: T
}

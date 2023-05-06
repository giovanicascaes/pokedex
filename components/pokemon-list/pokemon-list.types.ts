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
  skipFirstPageAnimations?: boolean
  removeOnRelease?: boolean
  onCatch?: (pokemon: PokemonSpeciesPokedex) => void
  onRelease: (id: number) => void
  onLoad?: () => void
}

export type PokemonListViewProps = Pick<
  PokemonListProps,
  | "pokemons"
  | "preloadPokemons"
  | "skipFirstPageAnimations"
  | "removeOnRelease"
  | "onCatch"
  | "onRelease"
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
    | "skipFirstPageAnimations"
    | "removeOnRelease"
    | "onCatch"
    | "onRelease"
    | "onLoad"
  > {
  animationProperties: PokemonListItemAnimationProperties
}

export interface PokemonListItemAnimationRunToken {
  cancel?: () => void
}

export type PokemonListContextData = Pick<
  PokemonListProps,
  "pokemons" | "preloadPokemons" | "skipFirstPageAnimations"
>

export type PokemonListContextActions = Pick<
  PokemonListProps,
  "onCatch" | "onRelease" | "onLoad"
>

export type PokemonListContextValue = [
  PokemonListContextData,
  PokemonListContextActions
]

export interface PokemonListProviderProps {
  children: ReactNode
}

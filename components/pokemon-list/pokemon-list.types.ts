import { PokemonSpeciesPokedex } from "contexts"
import { DetailedHTMLProps, HTMLAttributes } from "react"

export interface PokemonListProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  pokemons: PokemonSpeciesPokedex[]
  preloadPokemons?: PokemonSpeciesPokedex[]
  skipInitialAnimation?: boolean
  onAddToPokedex: (pokemon: PokemonSpeciesPokedex) => void
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

export interface UsePokemonListArgs
  extends Pick<
    PokemonListProps,
    | "pokemons"
    | "skipInitialAnimation"
    | "onAddToPokedex"
    | "onRemoveFromPokedex"
    | "onReady"
  > {
  listTrailLength?: number
}

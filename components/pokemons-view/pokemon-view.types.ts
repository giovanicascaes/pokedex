import { PokemonSpeciesSimple } from "lib"
import { DetailedHTMLProps, HTMLAttributes } from "react"

export interface PokemonViewProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  pokemons: PokemonSpeciesSimple[]
  hiddenPokemons?: PokemonSpeciesSimple[]
  skipInitialAnimation?: boolean
  onReady?: () => void
}

export type VisiblePokemonsProps = Pick<
  PokemonViewProps,
  "pokemons" | "skipInitialAnimation" | "onReady"
>

import { PokemonSpeciesSimple } from "lib"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { WithNonLegacyRef } from "types"

export interface PokemonListProps
  extends WithNonLegacyRef<
    DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
    HTMLUListElement
  > {
  pokemons: PokemonSpeciesSimple[]
  skipInitialAnimation?: boolean
  onReady?: () => void
}

export interface PokemonListItemData extends PokemonSpeciesSimple {
  y: number
  measureOnly?: boolean
}

export type PokemonListData = readonly [
  { height: number },
  PokemonListItemData[]
]

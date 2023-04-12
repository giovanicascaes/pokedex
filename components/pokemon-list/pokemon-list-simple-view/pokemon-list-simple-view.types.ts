import { PokemonSpeciesPokedex } from "contexts"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { WithNonLegacyRef } from "types"
import { PokemonListViewProps } from "../pokemon-list.types"

export type PokemonListSimpleViewProps = WithNonLegacyRef<
  DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
  HTMLUListElement
> &
  PokemonListViewProps

export interface PokemonListSimpleViewItemData extends PokemonSpeciesPokedex {
  y: number
}

export type PokemonListSimpleViewData = readonly [
  { height: number },
  PokemonListSimpleViewItemData[]
]

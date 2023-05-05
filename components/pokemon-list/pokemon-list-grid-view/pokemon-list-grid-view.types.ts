import { PokemonSpeciesPokedex } from "contexts"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { PokemonListViewProps } from "../pokemon-list.types"

export interface PokemonListGridViewProps
  extends Omit<
      DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
      "onLoad"
    >,
    PokemonListViewProps {
  columns: number
}

export interface PokemonListGridViewItemData extends PokemonSpeciesPokedex {
  x: number
  y: number
}

export type PokemonListGridViewData = readonly [
  { width: number; height: number },
  PokemonListGridViewItemData[]
]

export interface PokemonListItemAnimationState {
  opacity: number
  transform: string
}

import { PokemonSpeciesPokedex } from "contexts"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { PokemonListViewProps } from "../pokemon-list.types"

export interface PokemonListGridViewProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PokemonListViewProps {
  columns: number
}

export interface PokemonListGridViewItemData extends PokemonSpeciesPokedex {
  x: number
  y: number
  isGettingDimensions?: boolean
}

export type PokemonListGridViewData = readonly [
  { width: number; height: number },
  PokemonListGridViewItemData[]
]

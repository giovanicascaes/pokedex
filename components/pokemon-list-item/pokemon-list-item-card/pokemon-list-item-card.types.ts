import { DetailedHTMLProps, HTMLAttributes } from "react"
import { PokemonListItemViewProps } from "../pokemon-list-item.types"

export type PokemonListItemCardElement = HTMLDivElement

export type PokemonListItemCardProps = PokemonListItemViewProps &
  DetailedHTMLProps<
    HTMLAttributes<PokemonListItemCardElement>,
    PokemonListItemCardElement
  >

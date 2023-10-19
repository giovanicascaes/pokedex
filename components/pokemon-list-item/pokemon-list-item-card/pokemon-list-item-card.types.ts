import { DetailedHTMLProps, HTMLAttributes } from "react"
import { PokemonListItemProps } from "../pokemon-list-item.types"

export type PokemonListItemCardElement = HTMLDivElement

export type PokemonListItemCardProps = PokemonListItemProps &
  DetailedHTMLProps<
    HTMLAttributes<PokemonListItemCardElement>,
    PokemonListItemCardElement
  >

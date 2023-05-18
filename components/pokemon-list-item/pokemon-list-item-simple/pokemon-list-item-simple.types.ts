import { DetailedHTMLProps, HTMLAttributes } from "react"
import { PokemonListItemViewProps } from "../pokemon-list-item.types"

export type PokemonListItemSimpleElement = HTMLAnchorElement

export type PokemonListItemSimpleProps = PokemonListItemViewProps &
  DetailedHTMLProps<
    HTMLAttributes<PokemonListItemSimpleElement>,
    PokemonListItemSimpleElement
  >

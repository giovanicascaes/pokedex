import { DetailedHTMLProps, HTMLAttributes } from "react"
import { PokemonListItemProps } from "../pokemon-list-item.types"

export type PokemonListItemSimpleElement = HTMLDivElement

export type PokemonListItemSimpleProps = PokemonListItemProps &
  DetailedHTMLProps<
    HTMLAttributes<PokemonListItemSimpleElement>,
    PokemonListItemSimpleElement
  >

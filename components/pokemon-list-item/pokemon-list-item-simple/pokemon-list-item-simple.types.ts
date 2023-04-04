import { DetailedHTMLProps, HTMLAttributes } from "react"
import { PokemonListItemProps } from "../pokemon-list-item.types"

export type PokemonListItemSimpleProps = DetailedHTMLProps<
  HTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> &
  PokemonListItemProps

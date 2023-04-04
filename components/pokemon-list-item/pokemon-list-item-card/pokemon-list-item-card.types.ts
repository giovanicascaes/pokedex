import { DetailedHTMLProps, HTMLAttributes } from "react"
import { PokemonListItemProps } from "../pokemon-list-item.types"

export type PokemonListItemCardProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  PokemonListItemProps

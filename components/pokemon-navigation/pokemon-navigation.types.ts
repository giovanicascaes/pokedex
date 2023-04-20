import { PokemonSpeciesSimple } from "lib"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { WithNonLegacyRef } from "types"

export interface PokemonNavigationProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  previousPokemon: PokemonSpeciesSimple | null
  nextPokemon: PokemonSpeciesSimple | null
}

export interface PokemonNavigationButtonProps
  extends WithNonLegacyRef<
    DetailedHTMLProps<HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  to: PokemonSpeciesSimple
  backwards?: boolean
}

export type PokemonNavigationButtonArrowProps = Pick<
  PokemonNavigationButtonProps,
  "backwards"
>

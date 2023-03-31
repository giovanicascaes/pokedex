import { PokemonSpeciesSimple } from "lib"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { WithNonLegacyRef } from "types"

export interface PokemonNavigationButtonProps
  extends WithNonLegacyRef<
    DetailedHTMLProps<HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  toPokemon: PokemonSpeciesSimple
  forwards?: boolean
}

export interface PokemonNavigationButtonArrowProps {
  forwards?: boolean
}

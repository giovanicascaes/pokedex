import { EvolutionChainLink } from "lib"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { WithNonLegacyRef } from "types"

export interface PokemonEvolutionChainProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  evolutionChain: EvolutionChainLink
}

export interface PokemonEvolutionChainNodeContainerProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  vertical?: boolean
  enableWrap?: boolean
}

export interface PokemonEvolutionChainPathProps
  extends WithNonLegacyRef<
      DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
      HTMLDivElement
    >,
    EvolutionChainLink {
  vertical?: boolean
}

export interface PokemonEvolutionChainLinkProps
  extends PokemonEvolutionChainPathProps {
  vertical?: boolean
}

export interface PokemonEvolutionChainArrowProps
  extends DetailedHTMLProps<HTMLAttributes<SVGElement>, SVGElement> {
  vertical?: boolean
}

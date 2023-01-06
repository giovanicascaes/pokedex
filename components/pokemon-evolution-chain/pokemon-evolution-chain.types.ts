import { EvolutionChainLink } from "lib";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface PokemonEvolutionChainProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  evolutionChain: EvolutionChainLink;
}

export interface PokemonEvolutionChainNodeContainerProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  vertical?: boolean;
}

export interface PokemonEvolutionChainPathProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    EvolutionChainLink {}

export interface PokemonEvolutionChainLinkProps
  extends PokemonEvolutionChainPathProps {
  vertical?: boolean;
}

export interface PokemonEvolutionChainArrowProps
  extends DetailedHTMLProps<HTMLAttributes<SVGElement>, SVGElement> {
  vertical?: boolean;
}

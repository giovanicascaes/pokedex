import { PokemonSpeciesSimple } from "lib";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface PokemonEvolutionChainLinkCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  pokemon: PokemonSpeciesSimple;
  isBaby?: boolean;
}

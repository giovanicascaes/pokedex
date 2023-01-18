import { PokemonSpeciesDetailed } from "lib";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface PokemonDetailsProps {
  pokemon: PokemonSpeciesDetailed;
}

export type PokemonDetailsBadges = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

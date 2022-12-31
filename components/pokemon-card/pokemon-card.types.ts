import { PokemonArtProps } from "components/pokemon-art";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface PokemonCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    Pick<PokemonArtProps, "artSrc"> {
  identifier: number;
  name: string;
}

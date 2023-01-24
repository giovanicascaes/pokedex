import { PokemonArtProps } from "components";
import { DetailedHTMLProps, HTMLAttributes, RefObject } from "react";

export interface PokemonCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    Pick<PokemonArtProps, "artSrc"> {
  identifier: number;
  resourceName: string;
  name: string;
  animateArt?: boolean;
  onPokemonChanged?: (artRef: RefObject<HTMLElement>) => void;
  canChange?: boolean;
  isCaught?: boolean;
}

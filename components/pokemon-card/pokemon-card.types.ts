import { PokemonArtProps } from "components";
import { DetailedHTMLProps, HTMLAttributes, RefObject } from "react";

export interface PokemonCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    Pick<PokemonArtProps, "artSrc"> {
  identifier: number;
  resourceName: string;
  name: string;
  animateArt?: boolean;
  onPokemonAction?: (
    pokemonRef: RefObject<HTMLElement>,
    artRef: RefObject<HTMLElement>
  ) => void;
  actionAllowed?: boolean;
  isCaught?: boolean;
}

export interface PokemonCardCatchOrReleaseAnimationProps
  extends Pick<PokemonCardProps, "artSrc"> {
  artPosition: DOMRect;
  pokemonRef: RefObject<HTMLElement>;
  onFinish?: () => void;
}

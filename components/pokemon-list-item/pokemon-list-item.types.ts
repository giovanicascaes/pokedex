import { PokemonArtProps } from "components";
import { DetailedHTMLProps, HTMLAttributes, RefObject } from "react";

export interface PokemonListItemProps
  extends DetailedHTMLProps<
      HTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >,
    Pick<PokemonArtProps, "artSrc"> {
  identifier: number;
  resourceName: string;
  name: string;
  animateArt?: boolean;
  onPokemonAction?: (artRef: RefObject<HTMLElement>) => void;
  actionAllowed?: boolean;
  isCaught?: boolean;
}

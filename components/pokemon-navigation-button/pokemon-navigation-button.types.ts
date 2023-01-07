import { PokemonSpeciesSimple } from "lib";
import { DetailedHTMLProps, HTMLAttributes, Ref } from "react";

export interface PokemonNavigationButtonProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
    "ref"
  > {
  // `Next`'s `Link` api doesn't support legacy ref api (`string` type)
  ref?: Ref<HTMLAnchorElement>;
  toPokemon: PokemonSpeciesSimple;
  forwards?: boolean;
}

export interface PokemonNavigationButtonArrowProps {
  forwards?: boolean;
}

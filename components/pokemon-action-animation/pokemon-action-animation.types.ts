import { PokemonCardProps } from "components";
import { RefObject } from "react";

export interface PokemonActionAnimationProps
  extends Pick<PokemonCardProps, "artSrc"> {
  isBeingCaught?: boolean;
  artPosition: DOMRect;
  pokemonRef: RefObject<HTMLElement>;
  onFinish?: () => void;
  catchSize?: number;
  releaseSize?: number;
}

interface PokemonActionAgnosticAnimationProps
  extends Omit<
    PokemonActionAnimationProps,
    "isBeingCaught" | "catchSize" | "releaseSize"
  > {
  size: number;
}

export type PokemonCatchAnimationProps = PokemonActionAgnosticAnimationProps;

export type PokemonReleaseAnimationProps = PokemonActionAgnosticAnimationProps;

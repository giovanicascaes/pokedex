import { PokemonCardProps } from "components";

export interface PokemonActionAnimationProps
  extends Pick<PokemonCardProps, "artSrc"> {
  isBeingCaught?: boolean;
  artPosition: Omit<DOMRect, "toJSON">;
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

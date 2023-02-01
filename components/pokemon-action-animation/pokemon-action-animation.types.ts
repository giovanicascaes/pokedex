import { PokemonCardProps } from "components";

export interface PokemonActionAnimationProps
  extends Pick<PokemonCardProps, "artSrc"> {
  isBeingCaught?: boolean;
  artPosition: Omit<DOMRect, "toJSON">;
  onFinish?: () => void;
}

type PokemonActionAgnosticAnimationProps = Omit<
  PokemonActionAnimationProps,
  "isBeingCaught"
>;

export type PokemonCatchAnimationProps = PokemonActionAgnosticAnimationProps;

export type PokemonReleaseAnimationProps = PokemonActionAgnosticAnimationProps;

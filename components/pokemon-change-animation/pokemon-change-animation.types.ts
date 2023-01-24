import { PokemonCardProps } from "components";

export interface PokemonChangeAnimationProps
  extends Pick<PokemonCardProps, "artSrc"> {
  isBeingCaught?: boolean;
  artPosition: Omit<DOMRect, "toJSON">;
  onFinish?: () => void;
}

type PokemonChangeAgnosticAnimation = Omit<
  PokemonChangeAnimationProps,
  "isBeingCaught"
>;

export type PokemonCatchAnimationProps = PokemonChangeAgnosticAnimation;

export type PokemonReleaseAnimationProps = PokemonChangeAgnosticAnimation;

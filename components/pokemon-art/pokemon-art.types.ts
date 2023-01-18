import { DetailedHTMLProps, HTMLAttributes, Ref } from "react";

export interface PokemonArtProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    "ref"
  > {
  // `react-spring`'s `animated` api doesn't support legacy ref api (`string` type)
  ref?: Ref<HTMLDivElement>;
  artSrc: string | null;
  name: string;
  width: number;
  height: number;
  animate?: boolean;
}

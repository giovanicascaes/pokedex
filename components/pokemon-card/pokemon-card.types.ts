import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface PokemonCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  identifier: number;
  name: string;
  artSrc: string;
}

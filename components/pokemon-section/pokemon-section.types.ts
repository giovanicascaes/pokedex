import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface PokemonDetailsSectionProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  label?: string;
  transitionDuration?: number;
}

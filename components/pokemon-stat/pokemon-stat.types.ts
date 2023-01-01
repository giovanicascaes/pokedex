import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface PokemonStatProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  totalBars?: number;
  value: number;
  label: string;
  transitionDuration?: number;
  barPileClassName?: string;
}

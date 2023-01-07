import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface PokemonStatsMeterProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  totalBars?: number;
  value: number;
  label: string;
  transitionDuration?: number;
  barContainerClassName?: string;
}

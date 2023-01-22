import { PokemonSpeciesDetailed, PokemonVariety } from "lib";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export type PokemonProfileProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  Pick<PokemonSpeciesDetailed, "gender" | "shape"> &
  Pick<PokemonVariety, "abilities" | "height" | "weight">;

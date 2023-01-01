import { PokemonSpeciesDetailed, PokemonVariety } from "lib";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface PokemonProfileProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    Pick<PokemonSpeciesDetailed, "gender" | "shape">,
    Pick<PokemonVariety, "abilities" | "height" | "weight"> {}

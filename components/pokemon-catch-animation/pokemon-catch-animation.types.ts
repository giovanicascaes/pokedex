import { PokemonCardProps } from "components/pokemon-card";

export interface PokemonCatchAnimationProps
  extends Pick<PokemonCardProps, "artSrc"> {
  pokemonArtPosition: Omit<DOMRect, "toJSON">;
  onAddedToPokedex?: () => void;
}

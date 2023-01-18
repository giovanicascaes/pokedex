import { PokemonCardProps } from "components/pokemon-card";
import { PokemonSpeciesSimple } from "lib";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface PokemonListProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  > {
  pokemons: PokemonSpeciesSimple[];
  hiddenPokemons?: PokemonSpeciesSimple[];
  animateCards?: boolean;
  onListRendered?: () => void;
}

export interface AnimatedCardsTrailProps {
  pokemons: PokemonSpeciesSimple[];
  animateCards: boolean;
  onListRendered?: () => void;
}

export interface ViewportAwarePokemonCardProps
  extends PokemonSpeciesSimple,
    Pick<PokemonCardProps, "animateArt"> {
  onIntersectionChange: (isIntersecting: boolean, id: number) => void;
}

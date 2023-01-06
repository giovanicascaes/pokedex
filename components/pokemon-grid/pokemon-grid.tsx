import { animated, useTransition } from "@react-spring/web";
import { PokemonSimpleCard } from "components";
import { PokemonSpeciesSimple } from "lib";
import { twMerge } from "tailwind-merge";
import {
  PokemonGridPokemonList,
  PokemonGridPokemonListTuple,
  PokemonGridProps,
} from "./pokemon-grid.types";

const DEFAULT_DURATION = 150;

interface TrailProps {
  pokemons: PokemonSpeciesSimple[];
  duration: number;
}

function Trail({ pokemons, duration }: TrailProps) {
  const transitions = useTransition(pokemons, {
    config: {
      mass: 1,
      tension: 500,
      friction: 18,
      duration,
    },
    from: { opacity: 0, transform: "translateY(-20px)" },
    enter: {
      opacity: 1,
      transform: "translateY(0)",
    },
    trail: 50,
  });

  return (
    <>
      {transitions((style, { id, ...other }) => (
        <animated.li key={id} style={{ ...style }}>
          <PokemonSimpleCard key={id} identifier={id} {...other} />
        </animated.li>
      ))}
    </>
  );
}

export default function PokemonGrid({
  pokemons,
  transitionDuration = DEFAULT_DURATION,
  className,
  ...otherProps
}: PokemonGridProps) {
  let visiblePokemons: PokemonGridPokemonList;
  let pokemonsToPrefetch: PokemonGridPokemonList;

  if (Array.isArray(pokemons[0])) {
    [visiblePokemons, pokemonsToPrefetch] =
      pokemons as PokemonGridPokemonListTuple;
  } else {
    visiblePokemons = pokemons as PokemonGridPokemonList;
    pokemonsToPrefetch = [];
  }

  return (
    <ul
      {...otherProps}
      className={twMerge(
        "grid auto-rows-auto auto-cols-max grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6 p-10",
        className
      )}
    >
      <Trail pokemons={visiblePokemons} duration={transitionDuration} />
      {pokemonsToPrefetch.length > 0 && (
        <li className="hidden">
          {pokemonsToPrefetch.map(({ id, ...other }) => (
            <PokemonSimpleCard key={id} identifier={id} {...other} />
          ))}
        </li>
      )}
    </ul>
  );
}

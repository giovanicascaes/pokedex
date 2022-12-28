import { animated, useTransition } from "@react-spring/web";
import { PokemonSimpleCard } from "components/pokemon-card";
import { PokemonSimple } from "lib";
import { twMerge } from "tailwind-merge";
import {
  PokemonGridPokemonList,
  PokemonGridPokemonListTuple,
  PokemonGridProps,
} from "./pokemon-grid.types";

const DEFAULT_DURATION = 200;

interface TrailProps extends Pick<PokemonGridProps, "duration"> {
  pokemons: PokemonSimple[];
}

function PokemonTrail({ pokemons, duration }: TrailProps) {
  const transitions = useTransition(pokemons, {
    config: { mass: 1, tension: 500, friction: 18, duration },
    from: { opacity: 0, transform: "translateY(-20px)" },
    enter: {
      opacity: 1,
      transform: "translateY(0)",
    },
    delay: 100,
    trail: 100,
  });

  return (
    <>
      {transitions((style, { id, ...other }) => (
        <animated.div
          key={id}
          style={{ ...style, willChange: "transform, opacity" }}
        >
          <PokemonSimpleCard key={id} identifier={id} {...other} />
        </animated.div>
      ))}
    </>
  );
}

export default function PokemonGrid({
  pokemons,
  duration = DEFAULT_DURATION,
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
    <div
      className={twMerge(
        className,
        "grid auto-rows-auto auto-cols-max grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 overflow-hidden p-10"
      )}
      {...otherProps}
    >
      <PokemonTrail pokemons={visiblePokemons} duration={duration} />
      {pokemonsToPrefetch.length > 0 && (
        <div className="hidden">
          {pokemonsToPrefetch.map(({ id, ...other }) => (
            <PokemonSimpleCard key={id} identifier={id} {...other} />
          ))}
        </div>
      )}
    </div>
  );
}

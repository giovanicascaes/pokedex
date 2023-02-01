import {
  FadeOnChange,
  PokemonCard,
  PokemonGrid,
  PokemonList,
} from "components";
import { useMedia } from "hooks";
import { twMerge } from "tailwind-merge";
import { PokemonViewProps, VisiblePokemonsProps } from "./pokemon-view.types";

function VisiblePokemonsList({
  pokemons,
  animateCards,
  onListRendered,
  onInitialAnimationsDone,
}: VisiblePokemonsProps) {
  const columns = useMedia(
    [
      "(min-width: 768px)",
      "(min-width: 1024px)",
      "(min-width: 1280px)",
      "(min-width: 1536px)",
    ],
    [2, 3, 4, 5],
    1
  );
  console.log("🚀 ~ file: pokemon-view.tsx:27 ~ columns", columns)

  return (
    <FadeOnChange watchChangesOn={columns === 1}>
      {(isList) =>
        isList ? (
          <PokemonList pokemons={pokemons} />
        ) : (
          <PokemonGrid pokemons={pokemons} columns={columns} />
        )
      }
    </FadeOnChange>
  );
}

export default function PokemonView({
  pokemons,
  hiddenPokemons = [],
  animateCards = true,
  onListRendered,
  onInitialAnimationsDone,
  className,
  ...otherProps
}: PokemonViewProps) {
  return (
    <div {...otherProps} className={twMerge("flex flex-col", className)}>
      <VisiblePokemonsList
        pokemons={pokemons}
        animateCards={animateCards}
        onListRendered={onListRendered}
        onInitialAnimationsDone={onInitialAnimationsDone}
      />
      {hiddenPokemons.map(({ id, ...other }) => (
        <li key={id} className="hidden">
          <PokemonCard identifier={id} {...other} />
        </li>
      ))}
    </div>
  );
}

import { animated, easings, useTransition } from "@react-spring/web";
import { PokemonActionAnimation, PokemonCard } from "components";
import { usePokemonView } from "contexts";
import { useResizeObserver } from "hooks";
import { PokemonSpeciesSimple } from "lib";
import { useCallback, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  CatchingOrReleasingPokemonList,
  PokemonListData,
  PokemonListItemData,
  PokemonListProps,
} from "./pokemon-list.types";

const CONTAINER_BOTTOM_PADDING = 80;

const GRID_TRANSITION_DURATION = 600;

const LIST_TRAIL = 150;

interface ListAnimationControl {
  rendered: Set<number>;
}

export default function PokemonList({
  pokemons,
  className,
  style,
  ...other
}: PokemonListProps) {
  const [itemDimensions, setItemDimensions] = useState<DOMRect | null>(null);
  const [catchingOrReleasingPokemons, setCatchingOrReleasingPokemons] =
    useState<CatchingOrReleasingPokemonList[]>([]);
  const [{ pokedex }, { addPokemonToPokedex, removePokemonFromPokedex }] =
    usePokemonView();
  const [resizeObserverRef, containerRect] = useResizeObserver();
  const itemAnimationControl = useRef<ListAnimationControl>({
    rendered: new Set(),
  });

  const handleOnPokemonActionFinished = useCallback(
    (pokemon: PokemonSpeciesSimple) => {
      if (pokedex.some(({ id }) => id === pokemon.id)) {
        removePokemonFromPokedex(pokemon.id);
      } else {
        addPokemonToPokedex(pokemon);
      }

      setCatchingOrReleasingPokemons((current) =>
        current.filter(({ id }) => id !== pokemon.id)
      );
    },
    [addPokemonToPokedex, pokedex, removePokemonFromPokedex]
  );

  const [{ height: containerHeight }, gridItems] =
    useMemo<PokemonListData>(() => {
      // Renders the first pokemon only to get Pokémon card's dimensions
      if (!itemDimensions || !containerRect) {
        return [
          {
            height: 0,
          },
          pokemons.slice(0, 1).map((pokemon) => ({
            ...pokemon,
            y: 0,
            measureOnly: true,
          })),
        ];
      }

      const { height: itemHeight } = itemDimensions;
      const listItems = pokemons.map((pokemon, i) => {
        const y = i * itemHeight;

        return {
          ...pokemon,
          y,
        };
      });
      return [
        {
          // Adding extra padding for the loading element
          height: listItems.length * itemHeight + CONTAINER_BOTTOM_PADDING,
        },
        listItems,
      ];
    }, [itemDimensions, pokemons, containerRect]);

  const listTransitions = useTransition(gridItems, {
    key: ({ id }: PokemonListItemData) => id,
    from: ({ y }) => ({
      y,
      opacity: 0,
      transform: "translateY(-50px)",
    }),
    enter: ({ y }) => ({
      y,
      x: "0%",
      opacity: 1,
      transform: "translateY(0)",
    }),
    update: ({ y }) => ({ y }),
    leave: { x: "-100%", opacity: 0 },
    config: {
      mass: 5,
      tension: 500,
      friction: 100,
      duration: GRID_TRANSITION_DURATION,
      easing: easings.easeOutCirc,
    },
    onRest: (_result, _ctrl, { id }) => {
      if (id !== null) {
        itemAnimationControl.current.rendered.add(id);
      }
    },
    delay: (key) => {
      const typeSafeKey = key as unknown as number;

      if (itemAnimationControl.current.rendered.has(typeSafeKey)) {
        return 0;
      }

      return (
        pokemons
          .filter(({ id }) =>
            Array.from(itemAnimationControl.current.rendered.values()).every(
              (renderedId) => renderedId !== id
            )
          )
          .findIndex(({ id }) => id === typeSafeKey) * LIST_TRAIL
      );
    },
  });

  return (
    <animated.ul
      {...other}
      className={twMerge("relative", className)}
      style={{
        ...style,
        height: containerHeight,
      }}
    >
      {listTransitions((listStyles, pokemon) => {
        const { id, artSrc, measureOnly, ...other } = pokemon;
        const actionData = catchingOrReleasingPokemons.find(
          (actionPokemon) => actionPokemon.id === id
        );
        const isBeingCaughtOrReleased = !!actionData;
        const isCaught = pokedex.some(
          (pokedexPokemon) => pokedexPokemon.id === id
        );

        return (
          <animated.li
            key={id}
            className="absolute"
            style={{
              ...listStyles,
              ...(measureOnly && {
                opacity: 0,
              }),
            }}
            ref={(el) => {
              setItemDimensions(
                (curr) => curr ?? el?.getBoundingClientRect().toJSON()
              );
            }}
          >
            <PokemonCard
              {...other}
              artSrc={artSrc}
              identifier={id}
              onPokemonAction={(artRef) => {
                setCatchingOrReleasingPokemons((current) => [
                  ...current,
                  {
                    id,
                    artPosition: artRef.current
                      ?.getBoundingClientRect()
                      .toJSON(),
                  },
                ]);
              }}
              actionAllowed={!isBeingCaughtOrReleased}
              isCaught={isCaught}
            />
            {isBeingCaughtOrReleased && (
              <PokemonActionAnimation
                artPosition={actionData.artPosition}
                artSrc={artSrc}
                onFinish={() => handleOnPokemonActionFinished(pokemon)}
                isBeingCaught={!isCaught}
              />
            )}
          </animated.li>
        );
      })}
    </animated.ul>
  );
}

import { animated, easings, useTransition } from "@react-spring/web";
import { PokemonActionAnimation, PokemonListItem } from "components";
import { usePokemonView } from "contexts";
import { PokemonSpeciesSimple } from "lib";
import { useCallback, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  CatchingOrReleasingPokemonList,
  PokemonListData,
  PokemonListItemData,
  PokemonListProps
} from "./pokemon-list.types";

const CONTAINER_BOTTOM_PADDING = 80;

const LIST_GAP = 6;

const LIST_TRANSITION_DURATION = 300;

const LIST_TRAIL = 60;

const CAUGHT_OR_RELEASE_ANIMATION_SIZE = 40;

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

  const [{ height: containerHeight }, listItems] =
    useMemo<PokemonListData>(() => {
      // Renders the first pokemon only to get Pokémon card's dimensions
      if (!itemDimensions) {
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
        const y = i * itemHeight + i * LIST_GAP;

        return {
          ...pokemon,
          y,
        };
      });
      return [
        {
          // Adding extra padding for the loading element
          height:
            listItems.length * itemHeight +
            (listItems.length - 1) * LIST_GAP +
            CONTAINER_BOTTOM_PADDING,
        },
        listItems,
      ];
    }, [itemDimensions, pokemons]);

  const listTransitions = useTransition(listItems, {
    key: ({ id }: PokemonListItemData) => id,
    from: ({ y, measureOnly }) => ({
      y,
      opacity: 0,
      scale: measureOnly ? 1 : 0,
    }),
    enter: ({ y }) => ({
      y,
      x: "0%",
      opacity: 1,
      scale: 1,
    }),
    update: ({ y }) => ({ y }),
    leave: { x: "-100%", opacity: 0 },
    config: {
      mass: 5,
      tension: 500,
      friction: 100,
      duration: LIST_TRANSITION_DURATION,
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
            className="absolute w-full"
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
            <PokemonListItem
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
                catchSize={CAUGHT_OR_RELEASE_ANIMATION_SIZE}
                releaseSize={CAUGHT_OR_RELEASE_ANIMATION_SIZE}
              />
            )}
          </animated.li>
        );
      })}
    </animated.ul>
  );
}

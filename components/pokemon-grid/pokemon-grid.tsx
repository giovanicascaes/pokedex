import { animated, easings, useSpring, useTransition } from "@react-spring/web";
import { PokemonActionAnimation, PokemonCard } from "components";
import { usePokemonView } from "contexts";
import { useResizeObserver } from "hooks";
import { PokemonSpeciesSimple } from "lib";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  CatchingOrReleasingPokemon,
  PokemonGridData,
  PokemonGridItemData,
  PokemonGridProps
} from "./pokemon-grid.types";

const CONTAINER_BOTTOM_PADDING = 80;

const GRID_GAP_X = 30;

const GRID_GAP_Y = 40;

const GRID_TRAIL = 100;

const GRID_TRANSITION_DURATION = 300;

const CONTAINER_TRANSITION_DURATION = 300;

interface CardAnimationControl {
  rendered: Set<number>;
}

export default function PokemonGrid({
  pokemons,
  columns,
  ...other
}: PokemonGridProps) {
  const [cardDimensions, setCardDimensions] = useState<DOMRect | null>(null);
  const [catchingOrReleasingPokemons, setCatchingOrReleasingPokemons] =
    useState<CatchingOrReleasingPokemon[]>([]);
  const [{ pokedex }, { addPokemonToPokedex, removePokemonFromPokedex }] =
    usePokemonView();
  const [resizeObserverRef, containerRect] = useResizeObserver();
  const cardAnimationControl = useRef<CardAnimationControl>({
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

  const [{ width: containerWidth, height: containerHeight }, gridItems] =
    useMemo<PokemonGridData>(() => {
      // Renders the first pokemon only to get Pokémon card's dimensions
      if (!cardDimensions) {
        return [
          {
            width: 0,
            height: 0,
          },
          pokemons.slice(0, 1).map((pokemon) => ({
            ...pokemon,
            x: 0,
            y: 0,
            measureOnly: true,
          })),
        ];
      }

      const { width: cardWidth, height: cardHeight } = cardDimensions;
      const gridItems = pokemons.map((pokemon, i) => {
        const currColIdx = i % columns;
        const currRowIdx = Math.trunc(i / columns);
        const x = currColIdx * cardWidth + currColIdx * GRID_GAP_X;
        const y = currRowIdx * cardHeight + currRowIdx * GRID_GAP_Y;

        return {
          ...pokemon,
          x,
          y,
        };
      });
      const numberOfRows = Math.ceil(gridItems.length / columns);

      return [
        {
          width: columns * cardWidth + (columns - 1) * GRID_GAP_X,
          // Adding extra padding for the loading element
          height:
            numberOfRows * cardHeight +
            (numberOfRows - 1) * GRID_GAP_Y +
            CONTAINER_BOTTOM_PADDING,
        },
        gridItems,
      ];
    }, [cardDimensions, columns, pokemons]);

  const gridTransitions = useTransition(gridItems, {
    key: ({ id }: PokemonGridItemData) => id,
    from: ({ x, y }) => ({
      x,
      y,
      opacity: 0,
      transform: "translateY(-50px)",
    }),
    enter: ({ x, y }) => ({
      x,
      y,
      scale: 1,
      opacity: 1,
      transform: "translateY(0)",
    }),
    update: ({ x, y }) => ({ x, y }),
    leave: { scale: 0, opacity: 0 },
    config: {
      mass: 5,
      tension: 500,
      friction: 100,
      duration: GRID_TRANSITION_DURATION,
      easing: easings.easeOutSine,
    },
    onRest: (_result, _ctrl, { id }) => {
      if (id !== null) {
        cardAnimationControl.current.rendered.add(id);
      }
    },
    delay: (key) => {
      const typeSafeKey = key as unknown as number;

      if (cardAnimationControl.current.rendered.has(typeSafeKey)) {
        return 0;
      }

      return (
        pokemons
          .filter(({ id }) =>
            Array.from(cardAnimationControl.current.rendered.values()).every(
              (renderedId) => renderedId !== id
            )
          )
          .findIndex(({ id }) => id === typeSafeKey) * GRID_TRAIL
      );
    },
  });

  const containerStyles = useSpring({
    ...(containerRect && {
      x: (containerRect.width - containerWidth) / 2,
      config: {
        duration: CONTAINER_TRANSITION_DURATION,
        easing: easings.linear,
      },
    }),
  });

  return (
    <div {...other} ref={resizeObserverRef}>
      <animated.ul
        className="relative"
        style={{
          width: containerWidth,
          height: containerHeight,
          ...containerStyles,
        }}
      >
        {gridTransitions((gridStyles, pokemon) => {
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
                ...gridStyles,
                ...(measureOnly && {
                  opacity: 0,
                }),
              }}
              ref={(el) => {
                setCardDimensions(
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
    </div>
  );
}

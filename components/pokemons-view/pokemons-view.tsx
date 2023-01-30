import {
  animated,
  Controller,
  easings,
  useSpring,
  useTransition,
} from "@react-spring/web";
import {
  PokemonCard,
  PokemonChangeAnimation,
  ViewportAwarePokemonCard,
} from "components";
import { usePokemonView } from "contexts";
import { useMedia } from "hooks";
import { PokemonSpeciesSimple } from "lib";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import { PokemonsViewProps, VisiblePokemonsProps } from "./pokemons-view.types";

const VISIBLE_CARDS_TRAIL_DELAY = 50;

const CARD_TRANSITION_DURATION = 100;

const FADE_LIST_TRANSITION_DURATION = 150;

const GRID_GAP_X = 30;

const GRID_GAP_Y = 40;

interface PokemonBeingChanged {
  id: number;
  artPosition: Omit<DOMRect, "toJSON">;
}

interface CardAnimationsController {
  animations: {
    [k: number]: Controller;
  };
  queue: number[];
  done: number[];
  inView: number[];
}

function VisiblePokemonsList({
  pokemons,
  animateCards,
  onListRendered,
  onInitialAnimationsDone,
}: VisiblePokemonsProps) {
  const cardAnimationsController = useRef<CardAnimationsController>({
    animations: {},
    queue: [],
    done: [],
    inView: [],
  });
  const [renderablePokemons, setRenderablePokemons] = useState<
    PokemonSpeciesSimple[]
  >([]);
  const [pokemonsBeingChanged, setPokemonsBeingChanged] = useState<
    PokemonBeingChanged[]
  >([]);
  const [cardsDimensions, setCardsDimensions] = useState<Omit<
    DOMRect,
    "toJSON"
  > | null>(null);
  const [{ pokedex }, { addPokemonToPokedex, removePokemonFromPokedex }] =
    usePokemonView();
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

  const playNextCardAnimation = useCallback(() => {
    cardAnimationsController.current.queue.shift();

    const [nextId] = cardAnimationsController.current.queue;

    if (nextId) {
      cardAnimationsController.current.animations[nextId].start();
    }
  }, []);

  useEffect(() => {
    cardAnimationsController.current.animations = {
      ...cardAnimationsController.current.animations,
      ...pokemons
        .filter(
          (pokemon) => !cardAnimationsController.current.animations[pokemon.id]
        )
        .reduce(
          (prev, { id }) => ({
            ...prev,
            [id]: new Controller({
              config: {
                mass: 1,
                tension: 500,
                friction: 18,
                duration: CARD_TRANSITION_DURATION,
              },
              from: {
                opacity: 0,
                transform: "translateY(-30px)",
              },
            }).update({
              opacity: 1,
              transform: "translateY(0)",
              delay: VISIBLE_CARDS_TRAIL_DELAY,
              onStart: () => {
                playNextCardAnimation();
              },
              onRest: () => {
                cardAnimationsController.current.done.push(id);
              },
            }),
          }),
          {}
        ),
    };
    setRenderablePokemons(pokemons);
  }, [playNextCardAnimation, pokemons]);

  useLayoutEffect(() => {
    if (renderablePokemons.length) {
      onListRendered?.();
    }
  }, [onListRendered, renderablePokemons.length]);

  useEffect(() => {
    if (!animateCards) {
      let hasReachedViewport = false;

      Object.entries(cardAnimationsController.current.animations).forEach(
        ([id, controller]) => {
          let isInViewport = false;

          if (
            cardAnimationsController.current.inView.some(
              (inViewId) => inViewId.toString() === id
            )
          ) {
            hasReachedViewport = true;
            isInViewport = true;
          }

          if (!hasReachedViewport || isInViewport) {
            controller.start({
              opacity: 1,
              transform: "translateY(0px)",
              immediate: true,
            });
          }
        }
      );

      if (hasReachedViewport) {
        onInitialAnimationsDone();
      }
    }
  }, [animateCards, onInitialAnimationsDone, renderablePokemons]);

  const queueCardAnimation = useCallback((id: number) => {
    cardAnimationsController.current.queue.push(id);

    if (cardAnimationsController.current.queue.length === 1) {
      cardAnimationsController.current.animations[id].start();
    }
  }, []);

  const skipCardAnimation = useCallback((id: number) => {
    cardAnimationsController.current.animations[id].start({
      opacity: 1,
      transform: "translateY(0px)",
      immediate: true,
    });
  }, []);

  const handleIntersectionChange = useCallback(
    (isIntersecting: boolean, id: number) => {
      console.log("🚀 ~ file: pokemons-view.tsx:198 ~ id", id);
      console.log(
        "🚀 ~ file: pokemons-view.tsx:199 ~ isIntersecting",
        isIntersecting
      );
      if (isIntersecting) {
        cardAnimationsController.current.inView.push(id);

        if (animateCards) {
          queueCardAnimation(id);
        }
      } else {
        cardAnimationsController.current.inView =
          cardAnimationsController.current.inView.filter(
            (inViewId) => inViewId !== id
          );
      }
    },
    [animateCards, queueCardAnimation]
  );

  const handleOnPokemonChanged = useCallback(
    (pokemon: PokemonSpeciesSimple) => {
      if (pokedex.some(({ id }) => id === pokemon.id)) {
        removePokemonFromPokedex(pokemon.id);
      } else {
        addPokemonToPokedex(pokemon);
      }

      setPokemonsBeingChanged((current) =>
        current.filter(({ id }) => id !== pokemon.id)
      );
    },
    [addPokemonToPokedex, pokedex, removePokemonFromPokedex]
  );

  const [{ width: containerWidth, height: containerHeight }, gridItems] =
    useMemo(() => {
      const { width: cardWidth = 0, height: cardHeight = 0 } =
        cardsDimensions ?? {};
      const gridItems = renderablePokemons.map((pokemon, i) => {
        const currColIdx = i % columns;
        const currRowIdx = Math.trunc(i / columns);
        const x = cardWidth * currColIdx + currColIdx * GRID_GAP_X;
        const y = cardHeight * currRowIdx + currRowIdx * GRID_GAP_Y;

        return {
          ...pokemon,
          x,
          y,
        };
      });

      const numberOfRows = Math.ceil(gridItems.length / columns);

      return [
        {
          width: columns * cardWidth + GRID_GAP_X * (columns - 1),
          // Adding extra `80px` for the loading element
          height:
            numberOfRows * cardHeight + 80 + (numberOfRows - 1) * GRID_GAP_Y,
        },
        gridItems,
      ];
    }, [cardsDimensions, columns, renderablePokemons]);

  const gridTransitions = useTransition(gridItems, {
    key: ({ id }: PokemonSpeciesSimple) => id,
    from: ({ x, y }) => ({ x, y, scale: 1, opacity: 0 }),
    enter: ({ x, y }) => ({ x, y, opacity: 1 }),
    update: ({ x, y }) => ({ x, y }),
    leave: { scale: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    immediate: true,
  });

  // Hack to hide visual issues of list animation performance
  const fadeListTransition = useSpring({
    config: {
      easing: easings.linear,
      duration: FADE_LIST_TRANSITION_DURATION,
    },
    from: {
      opacity: 0,
    },
    to: {
      opacity: animateCards ? 1 : 0,
    },
  });

  return (
    <animated.ul
      className="relative mx-auto"
      style={{
        ...fadeListTransition,
        width: containerWidth,
        height: containerHeight,
      }}
    >
      {gridTransitions((gridStyles, pokemon) => {
        const { id, artSrc } = pokemon;
        const renderAnimationsController =
          cardAnimationsController.current.animations[id];
        const changingData = pokemonsBeingChanged.find(
          (pokemonBeingChanged) => pokemonBeingChanged.id === id
        );
        const isBeingChanged = !!changingData;
        const isCaught = pokedex.some(
          (pokedexPokemon) => pokedexPokemon.id === id
        );

        return (
          <animated.li
            key={id}
            className="absolute flex items-center justify-center w-min"
            style={{
              ...gridStyles,
              ...renderAnimationsController.springs,
            }}
            ref={(el) => {
              setCardsDimensions(
                (curr) => curr ?? el?.getBoundingClientRect().toJSON()
              );
            }}
          >
            <ViewportAwarePokemonCard
              {...pokemon}
              onIntersectionChange={handleIntersectionChange}
              animateArt={animateCards}
              onPokemonChanged={(artRef) => {
                setPokemonsBeingChanged((current) => [
                  ...current,
                  {
                    id,
                    artPosition: artRef.current
                      ?.getBoundingClientRect()
                      .toJSON(),
                  },
                ]);
              }}
              canChange={!isBeingChanged}
              isCaught={isCaught}
            />
            {isBeingChanged && (
              <PokemonChangeAnimation
                artPosition={changingData.artPosition}
                artSrc={artSrc}
                onFinish={() => handleOnPokemonChanged(pokemon)}
                isBeingCaught={!isCaught}
              />
            )}
          </animated.li>
        );
      })}
    </animated.ul>
  );
}

export default function PokemonList({
  pokemons,
  hiddenPokemons = [],
  animateCards = true,
  onListRendered,
  onInitialAnimationsDone,
  className,
  ...otherProps
}: PokemonsViewProps) {
  return (
    <div {...otherProps} className={twMerge("flex flex-col", className)}>
      <VisiblePokemonsList
        {...{ pokemons, animateCards, onListRendered, onInitialAnimationsDone }}
      />
      {hiddenPokemons.length > 0 &&
        hiddenPokemons.map(({ id, ...other }) => (
          <li key={id} className="hidden">
            <PokemonCard identifier={id} {...other} />
          </li>
        ))}
    </div>
  );
}

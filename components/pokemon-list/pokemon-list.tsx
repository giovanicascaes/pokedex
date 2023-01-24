import {
  animated,
  Controller,
  ControllerUpdate,
  easings,
  useSpring,
} from "@react-spring/web";
import {
  PokemonCard,
  PokemonChangeAnimation,
  ViewportAwarePokemonCard,
} from "components";
import { usePokemonView } from "contexts";
import { PokemonSpeciesSimple } from "lib";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import {
  PokemonListProps,
  VisiblePokemonListProps,
} from "./pokemon-list.types";

const VISIBLE_CARDS_TRAIL_DELAY = 50;

const CARD_TRANSITION_DURATION = 100;

const LIST_RANSITION_DURATION = 150;

interface PokemonBeingChanged {
  id: number;
  artPosition: Omit<DOMRect, "toJSON">;
}

function VisiblePokemonsList({
  pokemons,
  animateCards,
  onListRendered,
}: VisiblePokemonListProps) {
  const animationData = useRef<{
    controllers: {
      [k: number]: Controller;
    };
    queue: Array<{ id: number; props: ControllerUpdate }>;
  }>({
    controllers: {},
    queue: [],
  });
  const [renderablePokemons, setRenderablePokemons] = useState<
    PokemonSpeciesSimple[]
  >([]);
  const [isBackToListAnimationsDone, setIsBackToListAnimationsDone] =
    useState(true);
  const [pokemonBeingChanged, setPokemonBeingChanged] =
    useState<PokemonBeingChanged | null>(null);
  const [
    { pokedex },
    { addPokemonToPokedex: addPokemonToPoked, removePokemonFromPokedex },
  ] = usePokemonView();

  useEffect(() => {
    animationData.current.controllers = {
      ...animationData.current.controllers,
      ...pokemons
        .filter((pokemon) => !animationData.current.controllers[pokemon.id])
        .reduce(
          (prev, pokemon) => ({
            ...prev,
            [pokemon.id]: new Controller({
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
            }),
          }),
          {}
        ),
    };
    setRenderablePokemons(pokemons);
  }, [pokemons]);

  useLayoutEffect(() => {
    if (renderablePokemons.length) {
      onListRendered?.();
    }
  }, [onListRendered, renderablePokemons.length]);

  useEffect(() => {
    if (!animateCards) {
      setIsBackToListAnimationsDone(false);
    }
  }, [animateCards]);

  useEffect(() => {
    if (!isBackToListAnimationsDone && animationData.current.queue.length > 0) {
      let hasReachedViewport = false;

      Object.entries(animationData.current.controllers).forEach(
        ([id, controller]) => {
          let isInViewport = false;

          if (
            animationData.current.queue.some(
              (item) => item.id.toString() === id
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
        animationData.current.queue = [];
        setIsBackToListAnimationsDone(true);
      }
    }
  }, [isBackToListAnimationsDone, renderablePokemons]);

  const playNextAnimation = useCallback(() => {
    animationData.current.queue.shift();

    const [nextAnimation] = animationData.current.queue;

    if (nextAnimation) {
      const { id: nextId, props: nextProps } = nextAnimation;

      animationData.current.controllers[nextId].start(nextProps);
    }
  }, []);

  const animateCard = useCallback(
    (id: number) => {
      const props = {
        opacity: 1,
        transform: "translateY(0)",
        delay: VISIBLE_CARDS_TRAIL_DELAY,
        onStart: () => {
          playNextAnimation();
        },
      };

      animationData.current.queue.push({ id, props });

      if (animationData.current.queue.length === 1) {
        animationData.current.controllers[id].start(props);
      }
    },
    [playNextAnimation]
  );

  const skipCardAnimation = useCallback(
    (id: number) => {
      animationData.current.controllers[id].start({
        config: {
          duration: 0,
        },
        delay: 0,
        immediate: true,
        onStart: () => {
          playNextAnimation();
        },
      });
    },
    [playNextAnimation]
  );

  const handleIntersectionChange = useCallback(
    (isIntersecting: boolean, id: number) => {
      if (isBackToListAnimationsDone) {
        if (isIntersecting) animateCard(id);
        else skipCardAnimation(id);
      } else {
        animationData.current.queue.push({ id, props: {} });
      }
    },
    [animateCard, isBackToListAnimationsDone, skipCardAnimation]
  );

  const handleOnPokemonChanged = useCallback(
    (pokemon: PokemonSpeciesSimple) => {
      if (pokedex.some(({ id }) => id === pokemon.id)) {
        removePokemonFromPokedex(pokemon.id);
      } else {
        addPokemonToPoked(pokemon);
      }

      setPokemonBeingChanged(null);
    },
    [addPokemonToPoked, pokedex, removePokemonFromPokedex]
  );

  // Hack to hide visual issues of list animation performance
  const transition = useSpring({
    config: {
      easing: easings.linear,
      duration: LIST_RANSITION_DURATION,
    },
    from: {
      opacity: 0,
    },
    to: {
      opacity: isBackToListAnimationsDone ? 1 : 0,
    },
  });

  return (
    <>
      {renderablePokemons.map((pokemon) => {
        const controller = animationData.current.controllers[pokemon.id];
        const isBeingChanged = pokemon.id === pokemonBeingChanged?.id;
        const isCaught = pokedex.some(({ id }) => id === pokemon.id);

        return (
          <animated.li
            key={pokemon.id}
            className="flex items-center justify-center"
            style={{
              ...controller.springs,
            }}
          >
            <animated.div
              style={{
                ...transition,
              }}
            >
              <ViewportAwarePokemonCard
                {...pokemon}
                onIntersectionChange={handleIntersectionChange}
                animateArt={isBackToListAnimationsDone}
                onPokemonChanged={(artRef) => {
                  setPokemonBeingChanged({
                    id: pokemon.id,
                    artPosition: artRef.current
                      ?.getBoundingClientRect()
                      .toJSON(),
                  });
                }}
                canChange={!isBeingChanged}
                isCaught={isCaught}
              />
            </animated.div>
            {isBeingChanged && (
              <PokemonChangeAnimation
                artPosition={pokemonBeingChanged.artPosition}
                artSrc={pokemon.artSrc}
                onFinish={() => handleOnPokemonChanged(pokemon)}
                isBeingCaught={!isCaught}
              />
            )}
          </animated.li>
        );
      })}
    </>
  );
}

export default function PokemonList({
  pokemons,
  hiddenPokemons = [],
  animateCards = true,
  onListRendered,
  className,
  ...otherProps
}: PokemonListProps) {
  return (
    <ul
      {...otherProps}
      className={twMerge(
        "grid auto-rows-auto auto-cols-max grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-x-6 gap-y-8 p-10",
        className
      )}
    >
      <VisiblePokemonsList {...{ pokemons, animateCards, onListRendered }} />
      {hiddenPokemons.length > 0 &&
        hiddenPokemons.map(({ id, ...other }) => (
          <li key={id} className="hidden">
            <PokemonCard identifier={id} {...other} />
          </li>
        ))}
    </ul>
  );
}

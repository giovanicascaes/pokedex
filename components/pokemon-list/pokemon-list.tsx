import {
  animated,
  Controller,
  ControllerUpdate,
  easings,
  useSpring
} from "@react-spring/web";
import { PokemonCard, ViewportAwarePokemonCard } from "components";
import PokemonCatchAnimation from "components/pokemon-catch-animation/pokemon-catch-animation";
import { PokemonSpeciesSimple } from "lib";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { twMerge } from "tailwind-merge";
import {
  PokemonListProps,
  VisiblePokemonListProps
} from "./pokemon-list.types";

const VISIBLE_CARDS_TRAIL_DELAY = 50;

const CARD_TRANSITION_DURATION = 100;

const LIST_RANSITION_DURATION = 150;

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
  const [isImmediateAnimationsDone, setIsImmediateAnimationsDone] =
    useState(true);
  const [pokemonBeingCaught, setPokemonBeingCaught] = useState<{
    id: number;
    artPosition: Omit<DOMRect, "toJSON">;
  } | null>(null);

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
      setIsImmediateAnimationsDone(false);
    }
  }, [animateCards]);

  useEffect(() => {
    if (!isImmediateAnimationsDone && animationData.current.queue.length > 0) {
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
        setIsImmediateAnimationsDone(true);
      }
    }
  }, [isImmediateAnimationsDone, renderablePokemons]);

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
      if (isImmediateAnimationsDone) {
        if (isIntersecting) animateCard(id);
        else skipCardAnimation(id);
      } else {
        animationData.current.queue.push({ id, props: {} });
      }
    },
    [animateCard, isImmediateAnimationsDone, skipCardAnimation]
  );

  const handleOnPokemonAddedToPokedex = useCallback(
    (pokemon: PokemonSpeciesSimple) => {
      setPokemonBeingCaught(null);
    },
    []
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
      opacity: isImmediateAnimationsDone ? 1 : 0,
    },
  });

  return (
    <>
      {renderablePokemons.map((pokemon) => {
        const controller = animationData.current.controllers[pokemon.id];

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
                animateArt={isImmediateAnimationsDone}
                onCatchPokemon={(artPosition) => {
                  setPokemonBeingCaught({
                    id: pokemon.id,
                    artPosition,
                  });
                }}
              />
            </animated.div>
            {pokemon.id === pokemonBeingCaught?.id && (
              <PokemonCatchAnimation
                pokemonArtPosition={pokemonBeingCaught.artPosition}
                artSrc={pokemon.artSrc}
                onAddedToPokedex={() => handleOnPokemonAddedToPokedex(pokemon)}
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

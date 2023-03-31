import { animated, easings, useTransition } from "@react-spring/web"
import { PokemonListItem } from "components"
import { usePokemonView } from "contexts"
import { usePrevious } from "hooks"
import { PokemonSpeciesSimple } from "lib"
import { useCallback, useMemo, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import {
  PokemonListData,
  PokemonListItemData,
  PokemonListProps,
} from "./pokemon-list.types"
import useShouldAnimate from "./use-should-animate"

const CONTAINER_BOTTOM_PADDING = 20

const LIST_GAP = 10

const LIST_TRANSITION_DURATION = 300

const LIST_TRAIL = 60

interface ListAnimationControl {
  rendered: Set<number>
}

export default function PokemonList({
  pokemons,
  skipInitialAnimation = false,
  onReady,
  className,
  style,
  ...other
}: PokemonListProps) {
  const [itemDimensions, setItemDimensions] = useState<DOMRect | null>(null)
  const [{ pokedex }, { addPokemonToPokedex, removePokemonFromPokedex }] =
    usePokemonView()
  const itemAnimationControl = useRef<ListAnimationControl>({
    rendered: new Set(),
  })
  const prevPokemons = usePrevious(pokemons)
  const pokemonsHaveChanged = useMemo(
    () => prevPokemons && prevPokemons.length !== pokemons.length,
    [pokemons.length, prevPokemons]
  )
  const animate = useShouldAnimate(pokemonsHaveChanged, !skipInitialAnimation)

  const handleOnPokemonCatchReleaseFinished = useCallback(
    (pokemon: PokemonSpeciesSimple) => {
      if (pokedex.some(({ id }) => id === pokemon.id)) {
        removePokemonFromPokedex(pokemon.id)
      } else {
        addPokemonToPokedex(pokemon)
      }
    },
    [addPokemonToPokedex, pokedex, removePokemonFromPokedex]
  )

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
        ]
      }

      const { height: itemHeight } = itemDimensions
      const listItems = pokemons.map((pokemon, i) => {
        const y = i * itemHeight + i * LIST_GAP

        return {
          ...pokemon,
          y,
        }
      })
      return [
        {
          // Adding extra padding for the loading element
          height:
            listItems.length * itemHeight +
            (listItems.length - 1) * LIST_GAP +
            CONTAINER_BOTTOM_PADDING,
        },
        listItems,
      ]
    }, [itemDimensions, pokemons])

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
      itemAnimationControl.current.rendered.add(id)

      if (
        !pokemonsHaveChanged &&
        itemAnimationControl.current.rendered.size === pokemons.length
      ) {
        onReady?.()
      }
    },
    immediate: !animate,
    delay: (key) => {
      if (!animate) return 0

      const typeSafeKey = key as unknown as number

      if (itemAnimationControl.current.rendered.has(typeSafeKey)) {
        return 0
      }

      return (
        pokemons
          .filter(({ id }) =>
            Array.from(itemAnimationControl.current.rendered.values()).every(
              (renderedId) => renderedId !== id
            )
          )
          .findIndex(({ id }) => id === typeSafeKey) * LIST_TRAIL
      )
    },
  })

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
        const { id, artSrc, measureOnly, ...other } = pokemon
        const isOnPokedex = pokedex.some(
          (pokedexPokemon) => pokedexPokemon.id === id
        )

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
              )
            }}
          >
            <PokemonListItem
              {...other}
              artSrc={artSrc}
              identifier={id}
              isOnPokedex={isOnPokedex}
              onCatchReleaseFinish={() =>
                handleOnPokemonCatchReleaseFinished(pokemon)
              }
            />
          </animated.li>
        )
      })}
    </animated.ul>
  )
}

import { animated, easings, useTransition } from "@react-spring/web"
import { PokemonListItemSimple } from "components"
import { useMemo, useState } from "react"
import { twMerge } from "tailwind-merge"
import { omit } from "utils"
import usePokemonListView from "../use-pokemon-list-view"
import {
  PokemonListSimpleViewData,
  PokemonListSimpleViewItemData,
  PokemonListSimpleViewProps,
} from "./pokemon-list-simple-view.types"

const CONTAINER_BOTTOM_PADDING = 20

const LIST_GAP = 10

const LIST_TRANSITION_DURATION = 300

const LIST_TRAIL = 60

export default function PokemonListSimpleView({
  pokemons,
  preloadPokemons,
  skipInitialAnimation = false,
  onAddToPokedex,
  onRemoveFromPokedex,
  onReady,
  className,
  style,
  ...other
}: PokemonListSimpleViewProps) {
  const [itemDimensions, setItemDimensions] = useState<DOMRect | null>(null)
  const { handleOnPokemonCatchReleaseFinish, transitionProps } =
    usePokemonListView({
      onAddToPokedex,
      onRemoveFromPokedex,
      pokemons,
      listTrailLength: LIST_TRAIL,
      onReady,
      skipInitialAnimation,
    })

  const [{ height: containerHeight }, listItems] =
    useMemo<PokemonListSimpleViewData>(() => {
      // Renders the first pokemon only to get Pokémon card's dimensions
      if (!itemDimensions) {
        return [
          {
            height: 0,
          },
          pokemons.slice(0, 1).map((pokemon) => ({
            ...pokemon,
            y: 0,
            isGettingDimensions: true,
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
    key: ({ id, isGettingDimensions }: PokemonListSimpleViewItemData) =>
      isGettingDimensions ? "getDimensions" : id,
    from: ({ y, isGettingDimensions }) => ({
      y,
      opacity: 0,
      scale: isGettingDimensions ? 1 : 0,
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
    ...transitionProps,
  })

  return (
    <>
      <animated.ul
        {...other}
        className={twMerge("relative", className)}
        style={{
          ...style,
          height: containerHeight,
        }}
      >
        {listTransitions((listStyles, pokemon) => {
          const { id, artSrc, isOnPokedex, ...other } = omit(
            pokemon,
            "isGettingDimensions"
          )

          return (
            <animated.li
              key={id}
              className="absolute w-full"
              style={{
                ...listStyles,
              }}
              ref={(el) => {
                setItemDimensions(
                  (curr) => curr ?? el?.getBoundingClientRect().toJSON()
                )
              }}
            >
              <PokemonListItemSimple
                {...other}
                artSrc={artSrc}
                identifier={id}
                isOnPokedex={isOnPokedex}
                onCatchReleaseFinish={() =>
                  handleOnPokemonCatchReleaseFinish(pokemon)
                }
              />
            </animated.li>
          )
        })}
      </animated.ul>
      {preloadPokemons?.map(({ id, ...other }) => (
        <li key={id} className="hidden">
          <PokemonListItemSimple identifier={id} {...other} />
        </li>
      ))}
    </>
  )
}

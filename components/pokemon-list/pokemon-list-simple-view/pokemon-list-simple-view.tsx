import { animated, easings, useTransition } from "@react-spring/web"
import {
  IntersectionObserverPokemonListItemSimple,
  PokemonListItemSimple,
} from "components"
import { useIsServerHydrationComplete } from "hooks"
import { SHELL_LAYOUT_CONTAINER_ELEMENT_ID } from "lib"
import { useLayoutEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { twMerge } from "tailwind-merge"
import usePokemonListView from "../use-pokemon-list-view"
import {
  PokemonListSimpleViewData,
  PokemonListSimpleViewItemData,
  PokemonListSimpleViewProps,
} from "./pokemon-list-simple-view.types"

const CONTAINER_BOTTOM_PADDING = 20

const LIST_GAP = 10

const LIST_TRANSITION_DURATION = 300

const ITEM_TRAIL = 100

const ITEM_TRANSITION_DURATION = 300

const ITEM_ANIMATION_PROPERTIES = {
  trail: ITEM_TRAIL,
  duration: ITEM_TRANSITION_DURATION,
  values: {
    from: {
      opacity: 0,
      scale: 0.5,
    },
    to: {
      opacity: 1,
      scale: 1,
    },
  },
}

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
  const itemDimensionsRef = useRef<HTMLDivElement | null>(null)
  const {
    handleOnCatchReleaseFinish,
    handleOnIntersectionChange,
    getStyles,
    isAnimationDone,
  } = usePokemonListView({
    onAddToPokedex,
    onRemoveFromPokedex,
    pokemons,
    onReady,
    skipInitialAnimation,
    animationProperties: ITEM_ANIMATION_PROPERTIES,
  })

  const ready = useIsServerHydrationComplete()

  useLayoutEffect(() => {
    if (ready) {
      setItemDimensions(itemDimensionsRef.current!.getBoundingClientRect())
    }
  }, [ready])

  const [{ height: containerHeight }, listItems] =
    useMemo<PokemonListSimpleViewData>(() => {
      if (!itemDimensions) {
        return [
          {
            height: 0,
          },
          [],
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
    key: ({ id }: PokemonListSimpleViewItemData) => id,
    from: ({ y }) => ({
      y,
    }),
    enter: ({ y, id }) => ({
      y,
      x: "0%",
      opacity: isAnimationDone(id) ? 1 : 0,
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
  })

  if (!itemDimensions) {
    const { id, ...other } = pokemons[0]

    return ready
      ? createPortal(
          <div ref={itemDimensionsRef}>
            <PokemonListItemSimple {...other} identifier={id} />
          </div>,
          document.getElementById(SHELL_LAYOUT_CONTAINER_ELEMENT_ID)!
        )
      : null
  }

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
          const { id, artSrc, isOnPokedex, ...other } = pokemon

          return (
            <animated.li
              key={id}
              className="absolute w-full"
              style={{
                ...listStyles,
                ...getStyles(id),
              }}
            >
              <IntersectionObserverPokemonListItemSimple
                {...other}
                artSrc={artSrc}
                identifier={id}
                isOnPokedex={isOnPokedex}
                onCatchReleaseFinish={() => handleOnCatchReleaseFinish(pokemon)}
                onIntersectionChange={(isIntersecting: boolean) =>
                  handleOnIntersectionChange(pokemon.id, isIntersecting)
                }
              />
            </animated.li>
          )
        })}
      </animated.ul>
      {preloadPokemons?.map(({ id, ...other }) => (
        <li key={id} className="hidden">
          <IntersectionObserverPokemonListItemSimple
            identifier={id}
            {...other}
          />
        </li>
      ))}
    </>
  )
}

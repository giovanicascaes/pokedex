import { animated, easings, useTransition } from "@react-spring/web"
import {
  IntersectionObserverPokemonListItemSimple,
  PokemonListItemSimple,
} from "components"
import { useIsoMorphicEffect, useIsServerHydrationComplete } from "hooks"
import { SHELL_LAYOUT_CONTAINER_ELEMENT_ID } from "lib"
import { useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
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
    leave: {
      opacity: 0,
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
  const { handleOnCatchReleaseFinish, handleOnIntersectionChange, getStyles } =
    usePokemonListView({
      onAddToPokedex,
      onRemoveFromPokedex,
      pokemons,
      onReady,
      skipInitialAnimation,
      animationProperties: ITEM_ANIMATION_PROPERTIES,
    })

  const ready = useIsServerHydrationComplete()

  useIsoMorphicEffect(() => {
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
    enter: ({ y }) => ({
      y,
    }),
    update: ({ y }) => ({ y }),
    config: {
      mass: 5,
      tension: 500,
      friction: 100,
      duration: LIST_TRANSITION_DURATION,
      easing: easings.easeOutCirc,
    },
  })

  if (!itemDimensions) {
    const { id, ...other } = omit(pokemons[0], "isOnPokedex")

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
          const { id, ...other } = pokemon

          return (
            <animated.li
              key={id}
              className="absolute w-full"
              style={{
                opacity: 0,
                ...listStyles,
                ...getStyles(id),
              }}
            >
              <IntersectionObserverPokemonListItemSimple
                {...other}
                identifier={id}
                onCatchReleaseFinish={() => handleOnCatchReleaseFinish(pokemon)}
                onIntersectionChange={(isIntersecting: boolean) =>
                  handleOnIntersectionChange(id, isIntersecting)
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

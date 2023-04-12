import { animated, easings, useSpring, useTransition } from "@react-spring/web"
import {
  IntersectionObserverPokemonListItemCard,
  PokemonListItemCard,
} from "components"
import { usePrevious, useResizeObserver } from "hooks"
import { SHELL_LAYOUT_CONTAINER_ELEMENT_ID } from "lib"
import { useLayoutEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import usePokemonListView from "../use-pokemon-list-view"
import {
  PokemonListGridViewData,
  PokemonListGridViewItemData,
  PokemonListGridViewProps,
} from "./pokemon-list-grid-view.types"

const CONTAINER_BOTTOM_PADDING = 30

const CONTAINER_TRANSITION_DURATION = 300

const GRID_GAP_X = 20

const GRID_GAP_Y = 40

const GRID_TRANSITION_DURATION = 300

const CARD_TRAIL = 100

const CARD_TRANSITION_DURATION = 300

const CARD_ANIMATION_PROPERTIES = {
  trail: CARD_TRAIL,
  duration: CARD_TRANSITION_DURATION,
  values: {
    from: {
      opacity: 0,
      transform: "translateY(-50px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0px)",
    },
  },
}

export default function PokemonListGridView({
  pokemons,
  preloadPokemons,
  skipInitialAnimation = false,
  onAddToPokedex,
  onRemoveFromPokedex,
  onReady,
  columns,
  ...other
}: PokemonListGridViewProps) {
  const [cardDimensions, setCardDimensions] = useState<DOMRect | null>(null)
  const cardDimensionsRef = useRef<HTMLDivElement | null>(null)
  const [resizeObserverRef, containerRect] = useResizeObserver()
  const prevContainerRect = usePrevious(containerRect)
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
    animationProperties: CARD_ANIMATION_PROPERTIES,
  })

  useLayoutEffect(() => {
    setCardDimensions(cardDimensionsRef.current!.getBoundingClientRect())
  }, [])

  const [{ width: containerWidth, height: containerHeight }, gridItems] =
    useMemo<PokemonListGridViewData>(() => {
      if (!cardDimensions) {
        return [
          {
            width: 0,
            height: 0,
          },
          [],
        ]
      }

      const { width: cardWidth, height: cardHeight } = cardDimensions
      const gridItems = pokemons.map((pokemon, i) => {
        const currColIdx = i % columns
        const currRowIdx = Math.trunc(i / columns)
        const x = currColIdx * cardWidth + currColIdx * GRID_GAP_X
        const y = currRowIdx * cardHeight + currRowIdx * GRID_GAP_Y

        return {
          ...pokemon,
          x,
          y,
        }
      })
      const numberOfRows = Math.ceil(gridItems.length / columns)

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
      ]
    }, [cardDimensions, columns, pokemons])

  const gridTransitions = useTransition(gridItems, {
    key: ({ id }: PokemonListGridViewItemData) => id,
    from: ({ x, y }) => ({
      x,
      y,
    }),
    enter: ({ x, y, id }) => ({
      x,
      y,
      scale: 1,
      opacity: isAnimationDone(id) ? 1 : 0,
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
  })

  const containerStyles = useSpring({
    x: containerRect ? (containerRect.width - containerWidth) / 2 : 0,
    config: {
      duration: CONTAINER_TRANSITION_DURATION,
      easing: easings.linear,
    },
    immediate: !prevContainerRect,
  })

  if (!cardDimensions) {
    const { id, ...other } = pokemons[0]

    return createPortal(
      <div className="w-min" ref={cardDimensionsRef}>
        <PokemonListItemCard {...other} identifier={id} />
      </div>,
      document.getElementById(SHELL_LAYOUT_CONTAINER_ELEMENT_ID)!
    )
  }

  return (
    <>
      <div {...other} ref={resizeObserverRef}>
        <animated.ul
          className="relative"
          style={{
            width: containerWidth,
            height: containerHeight,
            opacity: containerRect ? 1 : 0,
            ...containerStyles,
          }}
        >
          {gridTransitions((gridStyles, pokemon) => {
            const { id, ...other } = pokemon

            return (
              <animated.li
                key={id}
                className="absolute"
                style={{
                  ...gridStyles,
                  ...getStyles(id),
                }}
              >
                <IntersectionObserverPokemonListItemCard
                  {...other}
                  identifier={id}
                  onCatchReleaseFinish={() =>
                    handleOnCatchReleaseFinish(pokemon)
                  }
                  onIntersectionChange={(isIntersecting: boolean) =>
                    handleOnIntersectionChange(pokemon.id, isIntersecting)
                  }
                />
              </animated.li>
            )
          })}
        </animated.ul>
      </div>
      {preloadPokemons?.map(({ id, ...other }) => (
        <li key={id} className="hidden">
          <IntersectionObserverPokemonListItemCard identifier={id} {...other} />
        </li>
      ))}
    </>
  )
}

import { animated, easings, useSpring, useTransition } from "@react-spring/web"
import { PokemonListItemCard } from "components"
import { useResizeObserver } from "hooks"
import { useMemo, useState } from "react"
import usePokemonListView from "../use-pokemon-list-view"
import {
  PokemonListGridViewData,
  PokemonListGridViewItemData,
  PokemonListGridViewProps,
} from "./pokemon-list-grid-view.types"

const CONTAINER_BOTTOM_PADDING = 30

const GRID_GAP_X = 20

const GRID_GAP_Y = 40

const GRID_TRANSITION_DURATION = 300

const CONTAINER_TRANSITION_DURATION = 300

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
  const [resizeObserverRef, containerRect] = useResizeObserver()
  const { handleOnPokemonCatchReleaseFinish, transitionProps } =
    usePokemonListView({
      onAddToPokedex,
      onRemoveFromPokedex,
      pokemons,
      onReady,
      skipInitialAnimation,
    })

  const [{ width: containerWidth, height: containerHeight }, gridItems] =
    useMemo<PokemonListGridViewData>(() => {
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
            isGettingDimensions: true,
          })),
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
    ...transitionProps,
  })

  const containerStyles = useSpring({
    ...(containerRect && {
      x: (containerRect.width - containerWidth) / 2,
      config: {
        duration: CONTAINER_TRANSITION_DURATION,
        easing: easings.linear,
      },
    }),
  })

  return (
    <>
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
            const { id, artSrc, isOnPokedex, isGettingDimensions, ...other } =
              pokemon

            return (
              <animated.li
                key={id}
                className="absolute"
                style={{
                  ...gridStyles,
                  ...(isGettingDimensions && {
                    opacity: 0,
                  }),
                }}
                ref={(el) => {
                  setCardDimensions(
                    (curr) => curr ?? el?.getBoundingClientRect().toJSON()
                  )
                }}
              >
                <PokemonListItemCard
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
      </div>
      {preloadPokemons?.map(({ id, ...other }) => (
        <li key={id} className="hidden">
          <PokemonListItemCard identifier={id} {...other} />
        </li>
      ))}
    </>
  )
}

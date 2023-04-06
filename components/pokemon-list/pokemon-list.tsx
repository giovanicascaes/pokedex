import { animated, easings, useSpring } from "@react-spring/web"
import { FadeOnChange } from "components"
import { useMedia } from "hooks"
import { useCallback, useMemo, useState } from "react"
import { twMerge } from "tailwind-merge"
import { PokemonListGridView } from "./pokemon-list-grid-view"
import { PokemonListSimpleView } from "./pokemon-list-simple-view"
import { PokemonListProps } from "./pokemon-list.types"

const CONTAINER_TRANSITION_DURATION = 300

export default function PokemonList({
  pokemons,
  preloadPokemons = [],
  skipInitialAnimation = false,
  onAddToPokedex,
  onRemoveFromPokedex,
  onReady,
  className,
  ...otherProps
}: PokemonListProps) {
  const [isListReady, setIsListReady] = useState(false)
  const mediaMatches = useMedia(
    [
      "(min-width: 0px)",
      "(min-width: 768px)",
      "(min-width: 1024px)",
      "(min-width: 1280px)",
      "(min-width: 1536px)",
    ],
    {
      fallback: [true, false, false, false, false],
    }
  )
  const columns = useMemo(
    () =>
      mediaMatches.reduce((prev, matches, i) => (matches ? i + 1 : prev), 1),
    [mediaMatches]
  )

  const containerStyles = useSpring({
    // opacity: isListReady || !skipInitialAnimation ? 1 : 0,
    config: {
      duration: CONTAINER_TRANSITION_DURATION,
      easing: easings.linear,
    },
  })

  const handleOnViewReady = useCallback(() => {
    setIsListReady(true)
    onReady?.()
  }, [onReady])

  const commonListViewProps = {
    pokemons,
    preloadPokemons,
    skipInitialAnimation,
    onAddToPokedex,
    onRemoveFromPokedex,
    onReady: handleOnViewReady,
  }

  return (
    <animated.div
      {...otherProps}
      className={twMerge("flex flex-col", className)}
      style={{ ...containerStyles }}
    >
      <FadeOnChange watch={columns === 1}>
        {(isSimpleView) =>
          isSimpleView ? (
            <PokemonListSimpleView {...commonListViewProps} />
          ) : (
            <PokemonListGridView
              {...commonListViewProps}
              columns={Math.max(columns, 2)}
            />
          )
        }
      </FadeOnChange>
    </animated.div>
  )
}

import { animated, easings, useSpring } from "@react-spring/web"
import { FadeOnChange } from "components"
import { useMedia } from "hooks"
import { useMemo } from "react"
import theme from "styles/theme"
import { twMerge } from "tailwind-merge"
import { PokemonListProvider } from "./context"
import { PokemonListGridView } from "./pokemon-list-grid-view"
import { PokemonListSimpleView } from "./pokemon-list-simple-view"
import {
  PokemonListContextActions,
  PokemonListContextData,
  PokemonListProps,
} from "./pokemon-list.types"

const CONTAINER_TRANSITION_DURATION = 300

const LIST_VIEW_TRANSITION_DURATION = 150

const { sm, md, lg } = theme!.screens as { [k: string]: string }

const xsQuery = `(min-width: 0px)`
const smQuery = `(min-width: ${sm})`
const mdQuery = `(min-width: ${md})`
const lgQuery = `(min-width: ${lg})`

export default function PokemonList({
  pokemons,
  preloadPokemons = [],
  skipFirstPageAnimations = false,
  removeOnRelease = false,
  onCatch,
  onRelease,
  onLoad,
  className,
  ...otherProps
}: PokemonListProps) {
  const mediaMatches = useMedia([xsQuery, smQuery, mdQuery, lgQuery], {
    fallback: [false, false, false, false],
  })
  const columns = useMemo(
    () => mediaMatches.lastIndexOf(true) + 1,
    [mediaMatches]
  )

  const containerStyles = useSpring({
    config: {
      duration: CONTAINER_TRANSITION_DURATION,
      easing: easings.linear,
    },
  })

  const data: PokemonListContextData = {
    pokemons,
    preloadPokemons,
    skipFirstPageAnimations,
  }

  const actions: PokemonListContextActions = {
    onCatch,
    onRelease,
    onLoad,
  }

  const commonListViewProps = {
    pokemons,
    preloadPokemons,
    skipFirstPageAnimations,
    removeOnRelease,
    onCatch,
    onRelease,
    onLoad,
  }

  return (
    <animated.div
      {...otherProps}
      className={twMerge("flex flex-col", className)}
      style={{ ...containerStyles }}
    >
      {columns > 0 && (
        <FadeOnChange
          watch={columns === 1}
          transitionDuration={LIST_VIEW_TRANSITION_DURATION}
        >
          {(isList) => (
            <PokemonListProvider value={[data, actions]}>
              {isList ? (
                <PokemonListSimpleView {...commonListViewProps} />
              ) : (
                <PokemonListGridView
                  {...commonListViewProps}
                  columns={Math.max(columns, 2)}
                />
              )}
            </PokemonListProvider>
          )}
        </FadeOnChange>
      )}
    </animated.div>
  )
}

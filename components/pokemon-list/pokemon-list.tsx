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

const { sm, md, lg } = theme!.screens as { [k: string]: string }

const xsQuery = `(min-width: 0px)`
const smQuery = `(min-width: ${sm})`
const mdQuery = `(min-width: ${md})`
const lgQuery = `(min-width: ${lg})`

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
  const mediaMatches = useMedia([xsQuery, smQuery, mdQuery, lgQuery], {
    fallback: [true, false, false, false],
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
    skipInitialAnimation,
  }

  const actions: PokemonListContextActions = {
    onAddToPokedex,
    onRemoveFromPokedex,
    onReady,
  }

  const commonListViewProps = {
    pokemons,
    preloadPokemons,
    skipInitialAnimation,
    onAddToPokedex,
    onRemoveFromPokedex,
    onReady,
  }

  return (
    <animated.div
      {...otherProps}
      className={twMerge("flex flex-col", className)}
      style={{ ...containerStyles }}
    >
      <FadeOnChange watch={columns === 1}>
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
    </animated.div>
  )
}

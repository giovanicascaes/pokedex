import {
  AnimatedGrid,
  Transition,
  PokemonListItemCard,
  PokemonListItemSimple,
} from "components"
import { useMedia } from "hooks"
import { useMemo } from "react"
import theme from "styles/theme"
import { omit } from "utils"
import { PokemonListProps } from "./pokemon-list.types"

const LIST_VIEW_GRID_GAP = 10

const LIST_VIEW_ANIMATION_TRAIL = 100

const LIST_VIEW_ANIMATION_DURATION = 300

const listViewAnimationConfig = {
  trail: LIST_VIEW_ANIMATION_TRAIL,
  duration: LIST_VIEW_ANIMATION_DURATION,
  from: {
    opacity: 0,
    scale: 0.5,
  },
  enter: {
    opacity: 1,
    scale: 1,
  },
  leave: {
    opacity: 0,
  },
}

const { sm, md, lg } = theme!.screens as { [k: string]: string }

const xsQuery = `(min-width: 0px)`
const smQuery = `(min-width: ${sm})`
const mdQuery = `(min-width: ${md})`
const lgQuery = `(min-width: ${lg})`

export default function PokemonList({
  pokemons,
  preload = [],
  skipFirstItemsAnimation = false,
  hideBeforeRelease = false,
  onCatch,
  onRelease,
  onLoad,
  className,
  ...other
}: PokemonListProps) {
  const mediaMatches = useMedia([xsQuery, smQuery, mdQuery, lgQuery])
  const columns = useMemo(
    () => mediaMatches.lastIndexOf(true) + 1,
    [mediaMatches]
  )

  if (columns === 0) return null

  const isOneColumn = columns === 1

  return (
    <Transition {...other} watch={isOneColumn}>
      {(isList) => (
        <AnimatedGrid
          items={pokemons}
          columns={isList ? 1 : Math.max(columns, 2)}
          columnsConfig={{
            1: {
              gapX: LIST_VIEW_GRID_GAP,
              gapY: LIST_VIEW_GRID_GAP,
              fillColumnWidth: true,
              animationConfig: listViewAnimationConfig,
            },
          }}
          skipFirstItemsAnimation={skipFirstItemsAnimation}
          onLoad={onLoad}
        >
          {({ item: pokemon, hide }) => {
            const { id } = pokemon

            const handleOnAnimationFinish = async () => {
              if (pokemon.isOnPokedex) {
                if (hideBeforeRelease) {
                  await hide(id)
                }

                onRelease(id)
              } else {
                onCatch?.(pokemon)
              }
            }

            const props = {
              ...omit(pokemon, "id"),
              pokemonId: id,
              onAnimationFinish: handleOnAnimationFinish,
            }

            return isList ? (
              <PokemonListItemSimple {...props} />
            ) : (
              <PokemonListItemCard {...props} />
            )
          }}
        </AnimatedGrid>
      )}
    </Transition>
  )
}

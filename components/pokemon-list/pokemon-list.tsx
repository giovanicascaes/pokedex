import {
  AnimatedGrid,
  PokemonListItemCard,
  PokemonListItemSimple,
  Transition,
} from "components"
import { useMedia } from "hooks"
import { useEffect, useMemo, useState } from "react"
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
  skipInitialAnimation = false,
  onCatch,
  onRelease,
  onLoad,
  className,
  ...other
}: PokemonListProps) {
  const [shouldAnimatePokemonsAppearance, setShouldAnimatePokemonsAppearance] =
    useState(!skipInitialAnimation)
  const mediaMatches = useMedia([xsQuery, smQuery, mdQuery, lgQuery])
  const columns = useMemo(
    () => mediaMatches.lastIndexOf(true) + 1,
    [mediaMatches]
  )

  useEffect(() => {
    if (skipInitialAnimation) {
      setShouldAnimatePokemonsAppearance(true)
    }
  }, [skipInitialAnimation])

  if (columns === 0) return null

  const isOneColumn = columns === 1

  return (
    <Transition {...other} watch={isOneColumn}>
      {(isList) => {
        const columnsInTransition = isList ? 1 : Math.max(columns, 2)

        return (
          <AnimatedGrid
            items={pokemons}
            columns={columnsInTransition}
            gapY={isList ? LIST_VIEW_GRID_GAP : undefined}
            animationConfig={isList ? listViewAnimationConfig : undefined}
            fillColumnWidth={isList}
            animateItemsAppearance={shouldAnimatePokemonsAppearance}
            onLoad={onLoad}
          >
            {({ item: pokemon, onRemove }) => {
              const { id } = pokemon

              const handleOnAnimationFinish = async () => {
                if (pokemon.isOnPokedex) {
                  await onRemove()
                  onRelease(id)
                } else {
                  onCatch?.(pokemon)
                }
              }

              const PokemonListItem = isList
                ? PokemonListItemSimple
                : PokemonListItemCard

              return (
                <PokemonListItem
                  {...omit(pokemon, "id")}
                  pokemonId={id}
                  onAnimationFinish={handleOnAnimationFinish}
                />
              )
            }}
          </AnimatedGrid>
        )
      }}
    </Transition>
  )
}

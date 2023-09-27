import {
  AnimatedGrid,
  Measure,
  PokemonListItemCard,
  PokemonListItemSimple,
  Transition,
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
  immediateAnimations = false,
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
      {(isList) => {
        const columnsInTransition = isList ? 1 : Math.max(columns, 2)
        const PokemonListItem = isList
          ? PokemonListItemSimple
          : PokemonListItemCard

        return (
          <Measure>
            <Measure.From>
              {(measureRef) => {
                const firstPokemon = pokemons[0]

                return (
                  <div className="relative">
                    <PokemonListItem
                      {...omit(firstPokemon, "id")}
                      pokemonId={firstPokemon.id}
                      className="invisible absolute -z-10 pointer-events-none"
                      ref={measureRef}
                    />
                  </div>
                )
              }}
            </Measure.From>
            <Measure.Value>
              {(rect) =>
                rect && (
                  <AnimatedGrid
                    items={pokemons}
                    columns={columnsInTransition}
                    itemWidth={rect.width}
                    itemHeight={rect.height}
                    gapY={isList ? LIST_VIEW_GRID_GAP : undefined}
                    animationConfig={
                      isList ? listViewAnimationConfig : undefined
                    }
                    immediateAnimations={immediateAnimations}
                    fillColumnWidth={isList}
                    onInitialDimensions={onLoad}
                  >
                    {({ item: pokemon }) => {
                      const { id } = pokemon

                      const handleOnAnimationFinish = async () => {
                        if (pokemon.isOnPokedex) {
                          onRelease(id)
                        } else {
                          onCatch?.(pokemon)
                        }
                      }

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
              }
            </Measure.Value>
          </Measure>
        )
      }}
    </Transition>
  )
}

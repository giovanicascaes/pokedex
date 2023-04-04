import { FadeOnChange } from "components"
import { useMedia } from "hooks"
import { useMemo } from "react"
import { twMerge } from "tailwind-merge"
import { PokemonListGridView } from "./pokemon-list-grid-view"
import { PokemonListSimpleView } from "./pokemon-list-simple-view"
import { PokemonListProps } from "./pokemon-list.types"

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
  const mediaMatches = useMedia(
    [
      "(min-width: 0px)",
      "(min-width: 768px)",
      "(min-width: 1024px)",
      "(min-width: 1280px)",
      "(min-width: 1536px)",
    ],
    {
      fallback: [false, false, false, true, false],
    }
  )
  const columns = useMemo(
    () =>
      mediaMatches.reduce((prev, matches, i) => (matches ? i + 1 : prev), 1),
    [mediaMatches]
  )

  const commonListViewProps = {
    pokemons,
    preloadPokemons,
    skipInitialAnimation,
    onAddToPokedex,
    onRemoveFromPokedex,
    onReady,
  }

  return (
    <div {...otherProps} className={twMerge("flex flex-col", className)}>
      <FadeOnChange watchChangesOn={columns === 1}>
        {(isList) =>
          isList ? (
            <PokemonListSimpleView {...commonListViewProps} />
          ) : (
            <PokemonListGridView
              {...commonListViewProps}
              columns={Math.max(columns, 2)}
            />
          )
        }
      </FadeOnChange>
    </div>
  )
}

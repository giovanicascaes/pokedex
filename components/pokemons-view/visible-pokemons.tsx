import { FadeOnChange, PokemonGrid, PokemonList } from "components"
import { useMedia } from "hooks"
import { VisiblePokemonsProps } from "./pokemon-view.types"

export default function VisiblePokemons({
  pokemons,
  skipInitialAnimation = false,
  onReady,
}: VisiblePokemonsProps) {
  const columns = useMedia(
    [
      "(min-width: 768px) and (max-width: 1023px)",
      "(min-width: 1024px) and (max-width: 1279px)",
      "(min-width: 1280px) and (max-width: 1535px)",
      "(min-width: 1536px)",
    ],
    [2, 3, 4, 5],
    1
  )

  return (
    <FadeOnChange watchChangesOn={columns === 1}>
      {(isList) =>
        isList ? (
          <PokemonList
            pokemons={pokemons}
            skipInitialAnimation={skipInitialAnimation}
            onReady={onReady}
          />
        ) : (
          <PokemonGrid pokemons={pokemons} columns={Math.max(columns, 2)} />
        )
      }
    </FadeOnChange>
  )
}

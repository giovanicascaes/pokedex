import { TransitionElement } from "components"
import { PokemonSpeciesPokedex } from "contexts"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { WithNonLegacyRef } from "types"

export interface PokemonListProps
  extends WithNonLegacyRef<
    DetailedHTMLProps<HTMLAttributes<TransitionElement>, TransitionElement>,
    TransitionElement
  > {
  pokemons: PokemonSpeciesPokedex[]
  skipInitialAnimation?: boolean
  onCatch?: (pokemon: PokemonSpeciesPokedex) => void
  onRelease: (id: number) => void
  onLoad?: () => void
}

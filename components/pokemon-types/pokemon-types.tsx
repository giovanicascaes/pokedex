import { PokemonSection } from "components"
import PokemonTypeGroup from "./pokemon-type-group"
import { PokemonTypesProps } from "./pokemon-types.types"

export default function PokemonTypes({
  types: { main, strengths, weaknesses },
}: PokemonTypesProps) {
  return (
    <>
      <PokemonSection label="Types">
        <PokemonTypeGroup types={main} />
      </PokemonSection>
      <PokemonSection label="Weaknesses">
        <PokemonTypeGroup types={weaknesses} />
      </PokemonSection>
      <PokemonSection label="Strengths">
        <PokemonTypeGroup types={strengths} />
      </PokemonSection>
    </>
  )
}

import PokemonNavigationButton from "./pokemon-navigation-button"
import { PokemonNavigationProps } from "./pokemon-navigation.types"

export default function PokemonNavigation({
  previousPokemon,
  nextPokemon,
}: PokemonNavigationProps) {
  return (
    <div className="flex max-md:flex-col max-md:space-y-6 w-full items-center">
      {previousPokemon && (
        <PokemonNavigationButton
          to={previousPokemon}
          className="max-md:w-full md:mr-6"
        />
      )}
      {nextPokemon && (
        <PokemonNavigationButton
          to={nextPokemon}
          backwards={false}
          className="max-md:w-full md:ml-auto"
        />
      )}
    </div>
  )
}

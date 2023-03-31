import { PokemonCard } from "components"
import { twMerge } from "tailwind-merge"
import { PokemonViewProps } from "./pokemon-view.types"
import VisiblePokemons from "./visible-pokemons"

export default function PokemonView({
  pokemons,
  hiddenPokemons = [],
  skipInitialAnimation = false,
  onReady,
  className,
  ...otherProps
}: PokemonViewProps) {
  return (
    <div {...otherProps} className={twMerge("flex flex-col", className)}>
      <VisiblePokemons
        pokemons={pokemons}
        skipInitialAnimation={skipInitialAnimation}
        onReady={onReady}
      />
      {hiddenPokemons.map(({ id, ...other }) => (
        <li key={id} className="hidden">
          <PokemonCard identifier={id} {...other} />
        </li>
      ))}
    </div>
  )
}

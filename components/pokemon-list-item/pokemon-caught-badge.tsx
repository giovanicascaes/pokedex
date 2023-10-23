import { Tooltip } from "components"
import { MdCatchingPokemon } from "react-icons/md"
import { PokemonCaughtBadgeProps } from "./pokemon-list-item.types"

export default function PokemonCaughtBadge({
  isCaught,
  style,
  ...other
}: PokemonCaughtBadgeProps) {
  return (
    <Tooltip content="In Pokédex">
      <div
        {...other}
        className="relative p-0.5 w-full h-full"
        onClick={(e) => e.preventDefault()}
      >
        <div
          className="cursor-help rounded-full w-full h-full bg-white focus"
          tabIndex={0}
        >
          <MdCatchingPokemon className="w-full h-full top-0 left-0 text-red-500 dark:text-red-500/90 absolute" />
        </div>
      </div>
    </Tooltip>
  )
}

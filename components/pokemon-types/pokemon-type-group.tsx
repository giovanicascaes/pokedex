import { PokemonTypeBadge } from "components"
import { PokemonTypeGroupProps } from "./pokemon-types.types"

export default function PokemonTypeGroup({ types }: PokemonTypeGroupProps) {
  return (
    <div className="w-full grid grid-cols-[repeat(auto-fit,180px)] gap-2">
      {types
        .sort(({ slot: slot1, name: name1 }, { slot: slot2, name: name2 }) => {
          const field1: number | string = slot1 ?? name1
          // Every type will always have or `slot` or `name`
          const field2 = (slot2 ?? name2) as typeof field1

          return field1 < field2 ? -1 : field1 > field2 ? 1 : 0
        })
        .map(({ name, color, isDouble }) => (
          <PokemonTypeBadge key={name} color={color} doubleDamage={isDouble}>
            {name}
          </PokemonTypeBadge>
        ))}
    </div>
  )
}

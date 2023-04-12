import { PokemonListItemCard } from "components"
import { IntersectionObserverPokemonListItemProps } from "../intersection-observer-pokemon-list-item.types"
import useIntersectionObserverPokemonListItem from "../use-intersection-observer-pokemon-list-item"

export default function IntersectionObserverPokemonListItemCard({
  onIntersectionChange,
  root,
  ...other
}: IntersectionObserverPokemonListItemProps) {
  const intersectionObserverRef = useIntersectionObserverPokemonListItem({
    onIntersectionChange,
    root,
    threshold: 0.1,
  })

  return <PokemonListItemCard {...other} ref={intersectionObserverRef} />
}

import { PokemonListItemSimple } from "components"
import { IntersectionObserverPokemonListItemProps } from "../intersection-observer-pokemon-list-item.types"
import useIntersectionObserverPokemonListItem from "../use-intersection-observer-pokemon-list-item"

export default function IntersectionObserverPokemonListItemSimple({
  onIntersectionChange,
  root,
  ...other
}: IntersectionObserverPokemonListItemProps) {
  const intersectionObserverRef = useIntersectionObserverPokemonListItem({
    onIntersectionChange,
    root,
    threshold: 0.5,
  })

  return <PokemonListItemSimple {...other} ref={intersectionObserverRef} />
}

import { PokemonListItemProps } from "components"
import { UseIntersectionObserverArgs } from "hooks"

export interface IntersectionObserverPokemonListItemProps
  extends PokemonListItemProps,
    Pick<UseIntersectionObserverArgs, "root" | "threshold"> {
  onIntersectionChange?: (isIntersecting: boolean) => void
}

export type UseIntersectionObserverPokemonListItemArgs = Pick<
  IntersectionObserverPokemonListItemProps,
  "onIntersectionChange" | "root" | "threshold"
>

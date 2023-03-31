import { PokemonCardProps } from "components"

export interface ViewportAwarePokemonCardProps extends PokemonCardProps {
  onIntersectionChange?: (isIntersecting: boolean) => void
}

import { env } from "utils"
import ClientSideComponent from "./client-side-component"
import { PokemonCatchReleaseAnimationProps } from "./pokemon-catch-release-animation.types"

export default function PokemonCatchReleaseAnimation({
  children,
  ...other
}: PokemonCatchReleaseAnimationProps) {
  if (env.isServer) {
    return children
  }

  return <ClientSideComponent {...other}>{children}</ClientSideComponent>
}

import { Children, useCallback } from "react"
import { env } from "utils"
import { PokemonCatchAnimation } from "./pokemon-catch-animation"
import { PokemonCatchReleaseAnimationProps } from "./pokemon-catch-release-animation.types"
import { PokemonReleaseAnimation } from "./pokemon-release-animation"
import useChildrenRect from "./use-children-rect"

function ClientSideComponent({
  state = "idle",
  onAnimationFinish: onFinishAnimation,
  className,
  children,
  ...other
}: PokemonCatchReleaseAnimationProps) {
  const animate = state !== "idle"
  const { trackedChildren, childrenRect } = useChildrenRect(
    Children.only(children),
    animate
  )
  const handleOnFinishAnimation = useCallback(() => {
    onFinishAnimation?.()
  }, [onFinishAnimation])

  const AnimationComponent =
    state === "catching" ? PokemonCatchAnimation : PokemonReleaseAnimation

  return (
    <>
      {animate && (
        <AnimationComponent
          {...other}
          onAnimationFinish={handleOnFinishAnimation}
          pokemonRect={childrenRect}
          className="absolute top-0 left-0 z-40 w-full h-full pointer-events-none"
        >
          {children}
        </AnimationComponent>
      )}
      {trackedChildren}
    </>
  )
}

export default function PokemonCatchReleaseAnimation({
  children,
  ...other
}: PokemonCatchReleaseAnimationProps) {
  if (env.isServer) {
    return children
  }

  return <ClientSideComponent {...other}>{children}</ClientSideComponent>
}

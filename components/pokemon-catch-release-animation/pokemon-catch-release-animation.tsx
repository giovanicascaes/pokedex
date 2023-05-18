import { useEvent } from "hooks"
import { Children, useCallback, useMemo, useState } from "react"
import { env } from "utils"
import {
  PokemonCatchReleaseAnimationProvider,
  usePokemonCatchReleaseAnimation,
} from "./context"
import { PokemonCatchAnimation } from "./pokemon-catch-animation"
import {
  PokemonCatchReleaseAnimationContextActions,
  PokemonCatchReleaseAnimationContextData,
  PokemonCatchReleaseAnimationProps,
  PokemonCatchReleaseAnimationState,
  PokemonCatchReleaseAnimationWrapperProps,
} from "./pokemon-catch-release-animation.types"
import { PokemonReleaseAnimation } from "./pokemon-release-animation"
import useChildrenRect from "./use-children-rect"

function PokemonCatchReleaseAnimationWrapper({
  children,
  className,
  ...other
}: PokemonCatchReleaseAnimationWrapperProps) {
  const [{ state }, { onAnimationFinish }] = usePokemonCatchReleaseAnimation()
  const isAnimating = state !== "idle"
  const { trackedChildren, childrenRect } = useChildrenRect(
    Children.only(children),
    isAnimating && env.isClient
  )

  const AnimationComponent =
    state === "catching" ? PokemonCatchAnimation : PokemonReleaseAnimation

  return (
    <>
      {isAnimating && (
        <AnimationComponent
          {...other}
          onAnimationFinish={onAnimationFinish}
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

function PokemonCatchReleaseAnimation({
  isOnPokedex = false,
  onAnimationFinish,
  children,
}: PokemonCatchReleaseAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const animationFinishHandlerCb = useEvent(onAnimationFinish)

  const runAnimation = useCallback(() => {
    setIsAnimating(true)
  }, [])

  const handleAnimationFinish = useCallback(() => {
    setIsAnimating(false)
    animationFinishHandlerCb?.()
  }, [animationFinishHandlerCb])

  const state = useMemo<PokemonCatchReleaseAnimationState>(() => {
    if (!isAnimating) return "idle"

    if (isOnPokedex) return "releasing"

    return "catching"
  }, [isAnimating, isOnPokedex])

  const data: PokemonCatchReleaseAnimationContextData = {
    state,
  }

  const actions: PokemonCatchReleaseAnimationContextActions = {
    onAnimationFinish: handleAnimationFinish,
  }

  return (
    <PokemonCatchReleaseAnimationProvider value={[data, actions]}>
      {children({
        runAnimation,
        isAnimating,
      })}
    </PokemonCatchReleaseAnimationProvider>
  )
}

export default Object.assign(PokemonCatchReleaseAnimation, {
  Wrapper: PokemonCatchReleaseAnimationWrapper,
})

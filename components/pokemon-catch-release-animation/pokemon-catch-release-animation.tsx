import { useEvent } from "hooks"
import { Children, useCallback, useMemo, useState } from "react"
import {
  PokemonCatchReleaseAnimationProvider,
  usePokemonCatchReleaseAnimation,
} from "./context"
import { PokemonCatchAnimation } from "./pokemon-catch-animation"
import {
  PokemonCatchReleaseAnimationAnimateProps,
  PokemonCatchReleaseAnimationContextActions,
  PokemonCatchReleaseAnimationContextData,
  PokemonCatchReleaseAnimationProps,
  PokemonCatchReleaseAnimationState,
} from "./pokemon-catch-release-animation.types"
import { PokemonReleaseAnimation } from "./pokemon-release-animation"
import useElementRect from "./use-element-rect"

function PokemonCatchReleaseAnimationAnimate({
  children,
  className,
  ...other
}: PokemonCatchReleaseAnimationAnimateProps) {
  const [{ state }, { onAnimationFinish }] = usePokemonCatchReleaseAnimation()
  const isAnimating = state !== "idle"
  const { elementObserved: childrenObserved, elementRect: childrenRect } =
    useElementRect(Children.only(children), isAnimating)

  const AnimationComponent =
    state === "catching" ? PokemonCatchAnimation : PokemonReleaseAnimation

  return (
    <>
      {childrenObserved}
      {isAnimating && (
        <AnimationComponent
          {...other}
          onAnimationFinish={onAnimationFinish}
          animatingElementRect={childrenRect}
          className="absolute top-0 left-0 z-40 w-full h-full pointer-events-none"
        >
          {children}
        </AnimationComponent>
      )}
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
  Animate: PokemonCatchReleaseAnimationAnimate,
})

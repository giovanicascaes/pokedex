import { useEvent } from "hooks"
import useElementRect from "hooks/use-element-rect"
import { Children, useCallback, useState } from "react"
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
} from "./pokemon-catch-release-animation.types"
import { PokemonReleaseAnimation } from "./pokemon-release-animation"

function PokemonCatchReleaseAnimationAnimate({
  children,
  className,
  ...other
}: PokemonCatchReleaseAnimationAnimateProps) {
  const [{ isOnPokedex, isAnimating }, { onAnimationFinish }] =
    usePokemonCatchReleaseAnimation()
  const [childrenObserved, childrenRect] = useElementRect(
    Children.only(children),
    isAnimating
  )

  const AnimationComponent = isOnPokedex
    ? PokemonReleaseAnimation
    : PokemonCatchAnimation

  return (
    <>
      {childrenObserved}
      {isAnimating && (
        <AnimationComponent
          {...other}
          pokemonRect={childrenRect}
          onAnimationFinish={onAnimationFinish}
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

  const data: PokemonCatchReleaseAnimationContextData = {
    isAnimating,
    isOnPokedex,
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

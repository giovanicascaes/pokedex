import { usePrevious } from "hooks"
import { Children, useCallback, useEffect, useState } from "react"
import { CatchAnimation } from "./catch-animation"
import { PokemonCatchReleaseAnimationProps } from "./pokemon-catch-release-animation.types"
import { ReleaseAnimation } from "./release-animation"
import useChildrenRect from "./use-children-rect"

export default function ClientSideComponent({
  isCaught = false,
  onAnimationFinish: onFinishAnimation,
  className,
  children,
  ...other
}: PokemonCatchReleaseAnimationProps) {
  const [animate, setAnimate] = useState(false)
  const { trackedChildren, childrenRect } = useChildrenRect(
    Children.only(children),
    animate
  )
  const prevIsCaught = usePrevious(isCaught)
  const haveBeenCaughtOrReleased =
    prevIsCaught !== undefined && prevIsCaught !== isCaught

  useEffect(() => {
    if (haveBeenCaughtOrReleased) {
      setAnimate(true)
    }
  }, [haveBeenCaughtOrReleased])

  const handleOnFinishAnimation = useCallback(() => {
    setAnimate(false)
    onFinishAnimation?.()
  }, [onFinishAnimation])

  const AnimationComponent = isCaught ? CatchAnimation : ReleaseAnimation

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
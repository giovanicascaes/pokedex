import { useCallback, useEffect, useRef, useState } from "react"
import AnimatedGridItemAnimationController from "./animated-grid-item-animation-controller"
import { AnimatedGridItem, UseAnimatedGridArgs } from "./animated-grid.types"

export default function useAnimationController<T extends AnimatedGridItem>({
  items = [],
  skipFirstItemsAnimation = false,
  animationConfig,
  onLoad,
}: UseAnimatedGridArgs<T>) {
  const animationControllerRef = useRef(
    new AnimatedGridItemAnimationController(animationConfig)
  )
  const [shouldAnimateFirstItems, setShouldAnimateFirstItems] = useState(
    !skipFirstItemsAnimation
  )

  const onIntersectionChange = useCallback(
    (id: number, isIntersecting: boolean) => {
      if (!shouldAnimateFirstItems) return

      if (isIntersecting) {
        animationControllerRef.current.queue(id)
      } else {
        animationControllerRef.current.skip(id)
      }
    },
    [shouldAnimateFirstItems]
  )

  const getStyles = useCallback(
    (id: number) => animationControllerRef.current.getStyles(id),
    []
  )

  const hide = useCallback(async (id: number) => {
    await animationControllerRef.current.hide(id)
  }, [])

  useEffect(() => {
    animationControllerRef.current.setItems(items)
  }, [items])

  useEffect(() => {
    if (!shouldAnimateFirstItems) {
      animationControllerRef.current.skipAll()
      setShouldAnimateFirstItems(true)
    }
  }, [shouldAnimateFirstItems, onLoad])

  useEffect(() => {
    return () => {
      // Not a React node
      // eslint-disable-next-line react-hooks/exhaustive-deps
      animationControllerRef.current.cancel()
    }
  }, [])

  return {
    handleOnIntersectionChange: onIntersectionChange,
    getStyles,
    hide,
  }
}

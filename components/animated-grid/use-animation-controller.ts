import { useCallback, useEffect, useRef } from "react"
import AnimatedGridItemAnimationController from "./animated-grid-item-animation-controller"
import {
  AnimatedGridItem,
  UseAnimationControllerArgs,
} from "./animated-grid.types"

export default function useAnimationController<T extends AnimatedGridItem>({
  items = [],
  animateItemsAppearance = true,
  animationConfig,
}: UseAnimationControllerArgs<T>) {
  const animationControllerRef = useRef(
    new AnimatedGridItemAnimationController(animationConfig)
  )
  const onIntersectionChange = useCallback(
    (id: number, isIntersecting: boolean) => {
      if (!animateItemsAppearance) return

      if (isIntersecting) {
        animationControllerRef.current.queue(id)
      } else {
        animationControllerRef.current.skip(id)
      }
    },
    [animateItemsAppearance]
  )

  const getStyles = useCallback(
    (id: number) => animationControllerRef.current.getStyles(id),
    []
  )

  const hideItem = useCallback(async (id: number) => {
    await animationControllerRef.current.hideItem(id)
  }, [])

  useEffect(() => {
    animationControllerRef.current.setItems(items)
  }, [items])

  useEffect(() => {
    if (!animateItemsAppearance) {
      animationControllerRef.current.skipAll()
    }
  }, [animateItemsAppearance])

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
    hideItem,
  }
}

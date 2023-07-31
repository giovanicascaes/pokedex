import { useCallback, useEffect, useRef } from "react"
import ItemsAnimationController from "./items-animation-controller"
import {
  AnimatedGridItem,
  UseAnimationControllerArgs,
} from "./animated-grid.types"

export default function useItemsAnimationController<
  T extends AnimatedGridItem
>({
  items = [],
  immediate = false,
  animationConfig,
  onExhaustQueue,
}: UseAnimationControllerArgs<T>) {
  const animationControllerRef = useRef(
    new ItemsAnimationController(animationConfig, onExhaustQueue)
  )
  const onIntersectionChange = useCallback(
    (id: number, isIntersecting: boolean) => {
      if (isIntersecting) {
        animationControllerRef.current.queue(id)
      } else {
        animationControllerRef.current.skip(id)
      }
    },
    []
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
    animationControllerRef.current.immediate = immediate
  }, [immediate])

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

import { easings, useTransition } from "@react-spring/web"
import { usePrevious } from "hooks"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  AnimatedGridItem,
  AnimatedGridItemData,
  UseGridItemsAnimationArgs,
  UseGridItemsAnimationTransitionRenderFn,
} from "./animated-grid.types"
import GridTrailAnimationController from "./grid-trail-animation-controller"

const GRID_POSITION_TRANSITION_DURATION = 300

export default function useGridItemsAnimation<T extends AnimatedGridItem>({
  items = [],
  immediate = false,
  animationConfig,
}: UseGridItemsAnimationArgs<T>) {
  const prevItems = usePrevious(items)
  const [displayedItems, setDisplayedItems] = useState(items)
  const trailAnimationControllerRef = useRef(
    new GridTrailAnimationController(animationConfig)
  )

  const itemsTransition = useTransition(displayedItems, {
    key: ({ id }: AnimatedGridItemData<T>) => id,
    from: ({ x, y }) => ({
      x,
      y,
    }),
    enter: ({ x, y }) => ({
      x,
      y,
    }),
    update: ({ x, y }) => ({ x, y }),
    config: {
      mass: 5,
      tension: 500,
      friction: 100,
      duration: GRID_POSITION_TRANSITION_DURATION,
      easing: easings.easeOutSine,
    },
  })

  const onItemVisibilityChange = useCallback(
    (id: number, isVisible: boolean) => {
      if (isVisible) {
        trailAnimationControllerRef.current.queue(id)
      } else {
        trailAnimationControllerRef.current.skip(id)
      }
    },
    []
  )

  useEffect(() => {
    const animateRemovedItemsIfAny = async () => {
      if (prevItems && prevItems.length > items.length) {
        await Promise.allSettled(
          prevItems
            .filter((prevItem) =>
              items.every((item) => item.id !== prevItem.id)
            )
            .map(({ id }) => trailAnimationControllerRef.current.hide(id))
        )
      }

      setDisplayedItems(items)
    }

    animateRemovedItemsIfAny()
  }, [items, prevItems])

  const transition = useCallback(
    (renderFn: UseGridItemsAnimationTransitionRenderFn<T>) =>
      itemsTransition((styles, item) =>
        renderFn(
          {
            ...animationConfig.from,
            ...trailAnimationControllerRef.current.getStyles(item.id),
            ...styles,
          },
          item
        )
      ),
    [animationConfig, itemsTransition]
  )

  useEffect(() => {
    trailAnimationControllerRef.current.items = displayedItems
  }, [displayedItems])

  useEffect(() => {
    trailAnimationControllerRef.current.immediate = immediate
  }, [immediate])

  useEffect(() => {
    return () => {
      // Safe, not a React node
      // eslint-disable-next-line react-hooks/exhaustive-deps
      trailAnimationControllerRef.current.cancel()
    }
  }, [])

  return {
    transition,
    onItemVisibilityChange,
  }
}

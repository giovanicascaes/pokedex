import { animated, easings, useSpring, useTransition } from "@react-spring/web"
import { IntersectionObserver } from "components"
import { usePrevious, useResizeObserver } from "hooks"
import { useCallback, useEffect, useMemo, useState } from "react"
import { omit } from "utils"
import {
  AnimatedGridData,
  AnimatedGridItem,
  AnimatedGridItemData,
  AnimatedGridProps,
} from "./animated-grid.types"
import useItemsAnimationController from "./use-items-animation-controller"

const ITEM_GRID_POSITION_TRANSITION_DURATION = 300

const CONTAINER_TRANSITION_DURATION = 300

const DEFAULT_GAP_X = 20

const DEFAULT_GAP_Y = 40

const DEFAULT_ANIMATION_CONFIG = {
  from: {
    opacity: 0,
    transform: "translateY(-50px)",
  },
  enter: {
    opacity: 1,
    transform: "translateY(0px)",
  },
  leave: {
    opacity: 0,
  },
}

export default function AnimatedGrid<T extends AnimatedGridItem>({
  items = [],
  columns = 1,
  itemWidth,
  itemHeight,
  gapX = DEFAULT_GAP_X,
  gapY = DEFAULT_GAP_Y,
  fillColumnWidth = false,
  animationConfig = DEFAULT_ANIMATION_CONFIG,
  immediateAnimations = false,
  onLoad,
  children,
}: AnimatedGridProps<T>) {
  const [isListLoaded, setIsListLoaded] = useState(false)

  const handleOnExhaustQueue = useCallback(() => {
    if (isListLoaded) return

    onLoad?.()
    setIsListLoaded(true)
  }, [isListLoaded, onLoad])

  const [resizeObserverRef, containerRect] = useResizeObserver({
    computeInitialRect: true,
  })
  const { getStyles, handleOnIntersectionChange, hideItem } =
    useItemsAnimationController({
      items,
      animationConfig,
      immediate: immediateAnimations,
      onExhaustQueue: handleOnExhaustQueue,
    })

  const [{ gridWidth, gridHeight, gridItemWidth }, gridItems] = useMemo<
    AnimatedGridData<T>
  >(() => {
    if (!containerRect) {
      return [
        {
          gridWidth: 0,
          gridHeight: 0,
          gridItemWidth: 0,
        },
        [],
      ]
    }

    const gridItemWidth = fillColumnWidth
      ? containerRect.width / columns
      : itemWidth
    const gridItems = items.map((item, i) => {
      const currColIdx = i % columns
      const currRowIdx = Math.trunc(i / columns)
      const x = currColIdx * gridItemWidth + currColIdx * gapX
      const y = currRowIdx * itemHeight + currRowIdx * gapY

      return {
        ...item,
        x,
        y,
      }
    })
    const numberOfRows = Math.ceil(gridItems.length / columns)

    return [
      {
        gridWidth: fillColumnWidth
          ? containerRect.width
          : columns * itemWidth + (columns - 1) * gapX,
        gridHeight: numberOfRows * itemHeight + (numberOfRows - 1) * gapY,
        gridItemWidth,
      },
      gridItems,
    ]
  }, [
    columns,
    containerRect,
    fillColumnWidth,
    gapX,
    gapY,
    itemHeight,
    itemWidth,
    items,
  ])
  const prevContainerRect = usePrevious(containerRect)

  const gridTransition = useTransition(gridItems, {
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
      duration: ITEM_GRID_POSITION_TRANSITION_DURATION,
      easing: easings.easeOutSine,
    },
  })

  const [gridStyles, gridApi] = useSpring(() => ({
    config: {
      duration: CONTAINER_TRANSITION_DURATION,
      easing: easings.linear,
    },
  }))

  useEffect(() => {
    if (containerRect) {
      gridApi.start({
        to: {
          x: (containerRect.width - gridWidth) / 2,
        },
        immediate: !prevContainerRect,
      })
    }
  }, [containerRect, gridApi, gridWidth, onLoad, prevContainerRect])

  if (!items.length) {
    return null
  }

  return (
    <div ref={resizeObserverRef}>
      <animated.ul
        className="relative"
        style={{
          width: gridWidth,
          height: gridHeight,
          ...gridStyles,
        }}
      >
        {gridTransition((gridItemStyles, item) => {
          const { id } = item
          return (
            <animated.li
              key={id}
              className="absolute"
              style={{
                opacity: 0,
                width: gridItemWidth,
                ...gridItemStyles,
                ...getStyles(id),
              }}
            >
              <IntersectionObserver
                disconnectOnceNoLongerVisible
                rootMargin="20%"
                onIntersectionChange={(isIntersecting: boolean) => {
                  handleOnIntersectionChange(item.id, isIntersecting)
                }}
              >
                {children({
                  item: omit(item, "x", "y") as unknown as T,
                  onRemove: () => hideItem(item.id),
                })}
              </IntersectionObserver>
            </animated.li>
          )
        })}
      </animated.ul>
    </div>
  )
}

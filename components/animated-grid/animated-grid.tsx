import { animated, easings, useSpring, useTransition } from "@react-spring/web"
import { IntersectionObserver } from "components"
import { useIsoMorphicEffect, usePrevious, useResizeObserver } from "hooks"
import { SHELL_LAYOUT_CONTAINER_ELEMENT_ID } from "lib"
import { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { join, omit } from "utils"
import {
  AnimatedGridData,
  AnimatedGridItem,
  AnimatedGridItemData,
  AnimatedGridProps,
} from "./animated-grid.types"
import useAnimationController from "./use-animation-controller"

const DEFAULT_GAP_X = 20

const DEFAULT_GAP_Y = 40

const DEFAULT_ITEM_TRANSITION_DURATION = 300

const defaultAnimationConfig = {
  trail: 100,
  duration: 300,
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

const CONTAINER_TRANSITION_DURATION = 300

export default function AnimatedGrid<T extends AnimatedGridItem>({
  items = [],
  columns = 1,
  columnsConfig = {},
  itemTransitionDuration = DEFAULT_ITEM_TRANSITION_DURATION,
  skipFirstItemsAnimation = false,
  onLoad,
  children,
}: AnimatedGridProps<T>) {
  const {
    gapX = DEFAULT_GAP_X,
    gapY = DEFAULT_GAP_Y,
    fillColumnWidth = false,
    animationConfig = defaultAnimationConfig,
  } = columnsConfig[columns] ?? {}

  const [itemDimensions, setItemDimensions] = useState<DOMRect | null>(null)
  const itemDimensionsRef = useRef<HTMLDivElement | null>(null)
  const [resizeObserverRef, containerRect] = useResizeObserver({
    computeInitialRect: true,
  })
  const { getStyles, handleOnIntersectionChange, hide } =
    useAnimationController({
      items,
      animationConfig,
      onLoad,
      skipFirstItemsAnimation,
    })

  useIsoMorphicEffect(() => {
    if (itemDimensionsRef.current) {
      setItemDimensions(itemDimensionsRef.current.getBoundingClientRect())
    }
  }, [])

  const [{ gridWidth, gridHeight, gridItemWidth }, gridItems] = useMemo<
    AnimatedGridData<T>
  >(() => {
    if (!itemDimensions || !containerRect) {
      return [
        {
          gridWidth: 0,
          gridHeight: 0,
          gridItemWidth: 0,
        },
        [],
      ]
    }

    const { width: itemWidth, height: itemHeight } = itemDimensions
    const gridItemWidth = fillColumnWidth
      ? containerRect.width / columns
      : itemWidth
    const gridGapX = fillColumnWidth ? 1 : gapX
    const gridItems = items.map((item, i) => {
      const currColIdx = i % columns
      const currRowIdx = Math.trunc(i / columns)
      const x = currColIdx * gridItemWidth + currColIdx * gridGapX
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
          : columns * itemWidth + (columns - 1) * gridGapX,
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
    itemDimensions,
    items,
  ])
  const prevGridWidth = usePrevious(gridWidth)

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
      duration: itemTransitionDuration,
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
    if (gridWidth) {
      gridApi.start({
        to: {
          x: (containerRect!.width - gridWidth) / 2,
        },
        immediate: !prevGridWidth,
      })

      if (prevGridWidth) {
        onLoad?.()
      }
    }
  }, [containerRect, gridApi, gridWidth, onLoad, prevGridWidth])

  if (!items.length) {
    return null
  }

  return (
    <div ref={resizeObserverRef}>
      {gridWidth > 0 ? (
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
                    hide,
                  })}
                </IntersectionObserver>
              </animated.li>
            )
          })}
        </animated.ul>
      ) : (
        createPortal(
          <div
            ref={itemDimensionsRef}
            className={join(!fillColumnWidth && "w-min")}
          >
            {children({ item: items[0], hide })}
          </div>,
          document.getElementById(SHELL_LAYOUT_CONTAINER_ELEMENT_ID)!
        )
      )}
    </div>
  )
}

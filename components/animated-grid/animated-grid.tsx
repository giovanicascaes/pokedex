import { animated } from "@react-spring/web"
import { IntersectionObserver } from "components"
import { useResizeObserver } from "hooks"
import { omit } from "utils"
import { AnimatedGridItem, AnimatedGridProps } from "./animated-grid.types"
import useGrid from "./use-grid"
import useGridAnimation from "./use-grid-animation"
import useGridItemsAnimation from "./use-grid-items-animation"

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
  columns,
  itemWidth,
  itemHeight,
  gapX = DEFAULT_GAP_X,
  gapY = DEFAULT_GAP_Y,
  animationConfig = DEFAULT_ANIMATION_CONFIG,
  immediateAnimations = false,
  fillColumnWidth = false,
  onLoad,
  children,
}: AnimatedGridProps<T>) {
  const [resizeObserverRef, containerRect] = useResizeObserver()

  const containerWidth = containerRect?.width ?? 0

  const [
    { width: gridWidth, height: gridHeight, itemWidth: gridItemWidth },
    gridItems,
  ] = useGrid({
    items,
    columns,
    itemWidth,
    itemHeight,
    gapX,
    gapY,
    fillColumnWidth,
    containerWidth,
  })

  const gridStyles = useGridAnimation({
    gridWidth,
    containerWidth,
    immediate: immediateAnimations,
    onInitialPositionSet: onLoad,
  })

  const { transition: itemsTransition, onItemVisibilityChange } =
    useGridItemsAnimation({
      items: gridItems,
      animationConfig,
      immediate: immediateAnimations,
    })

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
        {itemsTransition((itemStyles, item) => {
          const { id } = item

          return (
            <animated.li
              key={id}
              className="absolute"
              style={{
                ...itemStyles,
                width: gridItemWidth,
              }}
            >
              <IntersectionObserver
                disconnectOnceNoLongerVisible
                rootMargin="20%"
                onIntersectionChange={(isIntersecting: boolean) => {
                  onItemVisibilityChange(item.id, isIntersecting)
                }}
              >
                {children({
                  item: omit(item, "x", "y") as unknown as T,
                })}
              </IntersectionObserver>
            </animated.li>
          )
        })}
      </animated.ul>
    </div>
  )
}

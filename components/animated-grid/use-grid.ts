import { useMemo } from "react"
import {
  AnimatedGridData,
  AnimatedGridItem,
  UseGridArgs,
} from "./animated-grid.types"

export default function useGrid<T extends AnimatedGridItem>({
  items,
  columns,
  itemWidth,
  itemHeight,
  gapX,
  gapY,
  fillColumnWidth,
  containerWidth,
}: UseGridArgs<T>) {
  return useMemo<AnimatedGridData<T>>(() => {
    const gridItemWidth = fillColumnWidth ? containerWidth / columns : itemWidth
    const gridItems = items.map((item, i) => {
      const currColIdx = i % columns
      const currRowIdx = Math.trunc(i / columns)
      const x = currColIdx * gridItemWidth + currColIdx * gapX
      const y = currRowIdx * itemHeight + currRowIdx * gapY

      return {
        ...item,
        x,
        y,
        width: gridItemWidth,
      }
    })
    const numberOfRows = Math.ceil(gridItems.length / columns)

    return [
      {
        width: columns * gridItemWidth + (columns - 1) * gapX,
        height: numberOfRows * itemHeight + (numberOfRows - 1) * gapY,
        itemWidth: gridItemWidth,
      },
      gridItems,
    ]
  }, [
    columns,
    containerWidth,
    fillColumnWidth,
    gapX,
    gapY,
    itemHeight,
    itemWidth,
    items,
  ])
}

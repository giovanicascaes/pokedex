import { ReactElement } from "react"
import { WithRequired } from "types"

type AnimatedGridItemId = number

export interface AnimatedGridItem {
  id: AnimatedGridItemId
}

export interface AnimatedGridChildrenFnProps<T> {
  item: T
  onRemove: () => Promise<void>
}

interface AnimationValuesLookup<T = any> {
  [key: string]: T
}

export type GridItemsAnimationConfig = Record<
  "from" | "enter" | "leave",
  AnimationValuesLookup
>

export interface AnimatedGridProps<T> {
  items?: T[]
  columns?: number
  itemWidth: number
  itemHeight: number
  gapX?: number
  gapY?: number
  fillColumnWidth?: boolean
  animationConfig?: GridItemsAnimationConfig
  immediateAnimations?: boolean
  onLoad?: () => void
  children: (props: AnimatedGridChildrenFnProps<T>) => ReactElement
}

export interface AnimatedGridContainerData {
  gridWidth: number
  gridHeight: number
  gridItemWidth: number
}

export interface AnimatedGridItemStyle {
  x: number
  y: number
}

export type AnimatedGridItemData<T> = T & AnimatedGridItemStyle

export type AnimatedGridData<T> = readonly [
  AnimatedGridContainerData,
  Array<AnimatedGridItemData<T>>
]

export interface ItemAnimationRunToken {
  cancel?: () => void
}

export interface UseAnimationControllerArgs<T>
  extends Pick<AnimatedGridProps<T>, "items">,
    Required<Pick<AnimatedGridProps<T>, "animationConfig">> {
  immediate?: boolean
  onExhaustQueue?: () => void
}
